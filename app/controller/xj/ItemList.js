Ext.define('EQMS.controller.xj.ItemList', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			main: 'main',
			xjItemList: 'xjItemList',
			xjItemDetail: 'xjItemDetail'
		},
		control: {
			xjItemList:{
				itemtap: 'onListItemTap',
				tapcommit: 'saveItemList'
			}
		}
	},
	onListItemTap: function(list, index, target, record, e, eOpts){
		var it = this;
		var main = it.getMain();
		var action = e.target.getAttribute('action');
		var xjListRecord = list.getXjListRecord();
		var _classNo = list.down('selectfield#classes').getValue(); //班次
		var _checkTime = list.down('#checkTime').getValue(); //时间
		
		var store = list.getStore();
		store.setRemoteSort(true);
		
		if(action == 'nok'){
			var xjItemDetail = it.getXjItemDetail();
			if(!xjItemDetail) xjItemDetail = Ext.create('EQMS.view.xj.ItemDetail')
			
			xjItemDetail.setXjListRecord(xjListRecord);
			xjItemDetail.setXjItemListRecord(record);
			xjItemDetail.setXjItemList(list);
			var values = record.data;
			
			var correspondingNo = (xjListRecord.get('subId') != '' && xjListRecord.get('subId')  != null ? xjListRecord.get('subId')  : 'unSave')+'-'+record.get('itemId');
			//获取图片
			var _sql1 = " select  * from T_SYS_attachmentInfoUse where itemType = 'PP' and workStation = 'pad' and operator = '"+$userName+"' and correspondingNo = '"+correspondingNo+"'";
				
			var _params1 = {
				sql : _sql1
			};
			
			var url = 'xj/query';
			
			util.myAjax(url, _params1, function(response, request){
				var _data = Ext.decode(response.responseText).data;
				
				var activeTab = values.solveMethod;
				activeTab == 'quickSolve' || !activeTab ? xjItemDetail.setActiveItem(0) : (activeTab == 'nq' ? xjItemDetail.setActiveItem(1) : xjItemDetail.setActiveItem(2));
				
				var _form = xjItemDetail.getActiveItem();
				_form.setValues(values);
				
				//初始化图片
				Ext.each(_data, function(img){
					var _imgPanel = util.createImg(img.url, 1);
					
					xjItemDetail.down('camera').add(_imgPanel);
				})
			});
			
			main.push(xjItemDetail);
		}else if(action =='ok'){
			if(record.get('isaIndication') == '是'){
				var _readNum = Ext.create('Ext.form.Panel',{
					modal: true,
					layout:{
						type: 'vbox',
						align: 'center',
						pack: 'center'
					},
					hideOnMaskTap: true,
					showAnimation: {
						type: 'popIn',
						duration: 250,
						easing: 'ease-out'
					},
					hideAnimation: {
						type: 'popOut',
						duration: 250,
						easing: 'ease-out'
					},
					centered: true,
					width: Ext.filterPlatform('ie10') ? '100%' : (Ext.os.deviceType == 'Phone') ? 260 : 400,
					height: Ext.filterPlatform('ie10') ? '30%' : Ext.os.deviceType == 'Phone' ? 230 : 400,
					items: [
						{
							docked: 'top',
							xtype: 'toolbar',
							title: '读 数'
						},
						{
							xtype: 'numberfield',
							name: 'indication',
							width: '75%',
							required: true,
							labelWidth: 'auto',
							placeHolder: '读数',
							label: ''
						},
						{
							xtype: 'button',
							width: '75%',
							ui: 'blue',
							margin: '1em 0 0 0',
							text: '保 存',
							handler: function(){
								if(_readNum.getValues().indication != null && _readNum.getValues().indication != ''){
									it.onOkAndNaSave(action, list, record,  _readNum.getValues().indication);
									_readNum.hide();
								}else{
									Ext.toast('读数必填！');
								}
							}
						}
					],
					scrollable: null
				});
				Ext.Viewport.add(_readNum);
			}else{
				it.onOkAndNaSave(action, list, record, null);
			}
		}else if(action =='na'){
			it.onOkAndNaSave(action, list, record, null);
		}
	},
	onOkAndNaSave: function(action, list, record, indication){
		var _auditResult = action;
		var xjListRecord = list.getXjListRecord();
		record.set("indication",indication);
		record.set("auditResult",_auditResult);
	},
	saveItemList: function(view){
		var _xjListRecord = view.getXjListRecord();
		var _classNo = view.down('selectfield#classes').getValue(); //班次
		var _checkTime = view.down('#checkTime').getValue(); //时间
		
		var _items = view.getStore().getData().items;
		var cnt = 0;
		var it = this;
		Ext.each(_items, function(_item){
			if(_item.data.auditResult == null){
				cnt++
			}
		});
		
		if(!Ext.isEmpty(_classNo)){
			if(cnt == 0){
				var masterSubId = _xjListRecord.get('subId');
				var listSubId = _xjListRecord.get('listSubId');
				var listName = _xjListRecord.get('listName');
				var productionLine = _xjListRecord.get('productionLine');
				var _arr = [];
				Ext.each(_items, function(_item){
					_arr.push(_item.data);
				});
				
				var _xml = util.toXmlForDataFilters(_arr);
				
				var _sql = "exec SP_PAD_PP_saveAll @masterSubId="+masterSubId+", @listSubId = "+listSubId+",@listName='"+listName+"',@productionLine='"+productionLine+"', @auditor='"+ $userName+"',@auditorName='"+$userDescription+"',@inspectDate='"+Ext.Date.format(new Date(), 'Y-m-d H:i:s')+"',@checkTime = '"+Ext.Date.format(_checkTime, 'H:i')+"',@shift='"+_classNo+"', @xml="+_xml;
				
				var _params = {
					sql : _sql
				};
				
				var url = 'xj/query';
				
				util.myAjax(url, _params, function(response, request){
					var _data = Ext.decode(response.responseText);
					if(_data.success == 1){
						Ext.toast('提交成功!');
						it.getMain().pop();
					}else{
						Ext.toast(_data.message);
					}
				});
			}else{
				// util.showMessage('您存在未审核项，请确认', true);
				Ext.toast('您存在未审核项，请确认!');
			}
		}else{
			Ext.toast('请选择班次!');
		}
	}
});