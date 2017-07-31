Ext.define('EQMS.controller.lpa.ItemList', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			main: 'main',
			itemListView: 'itemList',
			itemDetail: 'itemDetail',
			lpaListView: 'lpaList',
			commit: 'itemList [itemId=commit]'
		},
		control: {
			itemListView: {
				itemtap: 'optTap',
				tapcommit: function(btn){
					this.saveItemList(btn);
				}
			}
		}
	},
	onPopview: function(view) {
		console.log("hlajdlajdl",view);
		var it = this;
		var _createDate = view.getLpaListRecord().get('createDate');
		if(!_createDate){
			Ext.Msg.confirm( '提示', '数据没有提交，是否确认返回？', function(buttonId, value ,opt){
				if(buttonId == 'yes'){
					it.getMain().pop();
				}
			});
		}else{
			it.getMain().pop();
		}
	},
	optTap: function( list, index, target, record, e, eOpts ){

		console.log("record",record);

		var action = e.target.getAttribute('action');
		console.log("list",Ext.Viewport.getActiveItem().getItems().items[3]);
		var _lapListRecord = list.getLpaListRecord(); //list选项
		//var _classNo = list.down('selectfield#classes').getValue(); //班次
		var it = this;
		var _itemDetail= it.getItemDetail();
		if(!_itemDetail) _itemDetail = Ext.create('EQMS.view.lpa.ItemDetail');
		_itemDetail.down('#lineName').setValue(_lapListRecord.get('field01'));
		var store = list.getStore();
		store.setRemoteSort(true);
		if (action == "nok") {

			_itemDetail.down('#lineName').setValue(_lapListRecord.get('field01'));
			_itemDetail.setLpaListRecord(_lapListRecord);
			_itemDetail.setItemListRecord(record);
			_itemDetail.setItemList(list);
			var values = record.data;
			console.log(values);
			//赋值
			if(values.solveMethod != '' && values.solveMethod != null){
				console.log(111111111);
				//_itemDetail.down('#lineName').setValue(_lapListRecord.get('field01'));
				var _form = _itemDetail;
				//确保可以选择工位
				values.field01 = _lapListRecord.get('field01');
				_form.setValues(values);
				//初始化图片
				it.initPicture(_itemDetail, values, _lapListRecord.data);
			}else if((values.solveMethod == '' || values.solveMethod == null) && values.auditResult == '不符合'){//未提交时的再次点入拍照
				console.log(87654321);
				//console.log("xiangdeshan",values.auditResult);
				var _createDate = _lapListRecord.get('createDate') == Ext.Date.format(new Date(),'Y-m-d H:i:s') ? '' : Ext.Date.format(_lapListRecord.get('createDate'),'Y-m-d H:i:s');
				var _workDate = util.dateToString(_lapListRecord.get('workDate'));
				var _stepId = _lapListRecord.get('stepId');
				var _groupId = _lapListRecord.get('groupId');
				//console.log("getlistId",_lapListRecord.get('listId'));
				var _listSubId = _lapListRecord.get('listId');
				var _itemSubId = record.get('itemSubId');
				//console.log("_itemSubId",_itemSubId);
				var _params1 = {
					createDate : _createDate,
					workDate : _workDate,
					auditorId : $userName,
					stepId : _stepId,
					groupId : _groupId,
					listSubId : _listSubId,
					itemSubId : _itemSubId
				};
				var url = 'lpa/getListItemRecord';
				util.myAjax(url, _params1, function(response, request){
					var _data = Ext.decode(response.responseText).data;
					var _form = _itemDetail;
					
					//初始化图片
					it.initPicture(_itemDetail, _data[0], _lapListRecord.data);
				});
			}
			it.getMain().push(_itemDetail);
		}else if(action != null && action != ''){
			var _auditResult = action == 'ok' ? '符合':'不适用';
			_itemDetail.down('#lineName').setValue(_lapListRecord.get('field01'));
			record.set("auditResult", _auditResult);
			record.set("nOKStatus", _auditResult);
			record.set("solveMethod", _auditResult);
		}
	},
	initPicture: function(view, itemRecord, listRecord){//初始化图片
		var it = this;
		var _createDate = (listRecord.createDate == null) ? Ext.Date.format(new Date(), 'Y-m-d H:i:s') : Ext.Date.format(listRecord.createDate, 'Y-m-d H:i:s')
		
		var _id = itemRecord.itemSubId + '' + listRecord.listId +''+listRecord.stepId + '-'+_createDate
		var _params1 = {
			applicationType : '分层审核',
			subID : _id,
			workStation : 'pad',
			operator : $userName,
			showType : 'listGrid',
			modelType : '分层审核'
		};
		var url = 'lpa/getAttachment';
		util.myAjax(url, _params1, function(response, request){
			var _data = Ext.decode(response.responseText).data;
			Ext.each(_data, function(img){
				var _imgPanel = util.createImg(img.url, 1);
				view.down('camera').add(_imgPanel);
			})
		});
	},
	saveItemList: function(btn){
		//console.log(1111111111);
		var view = this.getItemListView();
		if(!view) view = Ext.create('EQMS.view.lpa.ItemList');
		var _items = view.getStore().getData().items;
		
		var cnt = 0;
		var it = this;
		Ext.each(_items, function(_item){
			if(_item.data.auditResult == null){
				cnt++
			}
		});
		
		if(cnt == 0){
			var _lpaListRecord = view.getLpaListRecord().data; //list选项Ext.Date.format
			console.log("_lpaListRecord",_lpaListRecord);
			var _workDate =( _lpaListRecord.workDate != null) ? Ext.Date.format(_lpaListRecord.workDate,'Y-m-d') : Ext.Date.format(new Date(),'Y-m-d');
			var _createDate = (_lpaListRecord.createDate != null) ?  Ext.Date.format(_lpaListRecord.createDate,'Y-m-d H:i:s')  : Ext.Date.format(new Date(),'Y-m-d H:i:s');
			
			//保存注塑机器型号
			var _molding = view.down('textfield#molding').getValue();
			var _stepId = _lpaListRecord.stepId;
			var _groupId = _lpaListRecord.groupId;
			var _groupName = _lpaListRecord.groupName;
			var _stepName = _lpaListRecord.stepName;
			var _listSubId = _lpaListRecord.listId;
			var _listName = _lpaListRecord.listName;
			var _month = _lpaListRecord.month;
			var _field01 = _lpaListRecord.field01;
			var _arr = [];
			Ext.each(_items, function(_item){
				//用法！！！
				//_item.data.classes = _classNo;
				//注塑
				_item.data.field04= _molding;
				//用法！！！
				_item.data.auditorName = $userDescription;
				_item.data.auditor = $userName;
				_item.data.listName = _listName;
				_item.data.stepId = _stepId;
				_item.data.stepName = _stepName;
				_item.data.groupId = _groupId;
				_item.data.groupName = _groupName;
				_item.data.field01 = _field01;
				_item.data.commissionAgent = $userName;
				_item.data.commissionAgentName = $userDescription;
				_arr.push(_item.data);
			});
			var _xml = util.toXmlForDataFilters(_arr);

			//console.log("_xml",_xml);
			var _params = {
				userName : $userName,
				workDate :_workDate,
				listSubId:_listSubId,
				createDate:_createDate,
				workStation:'pad',
				xml:_xml
			};
			var _params1 = {
				taskUsername : $userName,
				workDate :_workDate,
				month:_month,
				listName:_listName,
				listId:_listSubId,
				groupId:_groupId,
				stepName:_stepName,
				stepId:_stepId,
				groupName:_groupName
			};
			var url = 'lpa/savePlanPerItemDetail';
			util.myAjax(url, _params, function(response, request){
				//console.log("测试测试测试测试测试测试");
				var _data = Ext.decode(response.responseText);
				if(_data.success == 1){
					//it.getMain().pop();
					var url1 = 'lpa/saveResult';
					util.myAjax(url1, _params1, function(response1, request1){
						var _data1 = Ext.decode(response1.responseText);
						if(_data1.success == 1){
							Ext.toast('提交成功!');
							it.getMain().pop();
						}else{
							Ext.toast(_data.message);
						}
					});
				}else{
					Ext.toast(_data.message);
				}
			});

		}else{
			Ext.toast('您存在未审核项，请确认!');
		}
	},
	tapBackBtn: function(){
		console.log(2345678);
	}
});