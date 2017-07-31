	Ext.define('EQMS.controller.lpa.LpaList', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			main: 'main',
			itemList: 'itemList',
			lpaListView: 'lpaList',
			calendar: 'lpaList #calendar'
		},
		control: {
			lpaListView: {
				activate: 'onActivate',
				itemtap: 'onItemListSelect'
			},
			calendar: {
				selectionchange: 'onSelChange', //选择了某一天(灰色选中的日期)
				periodchange: 'onPeriodChange', //此事件表示日期范围变了（也就是左右滑动改变了月）
				refresh: 'onCalendarRefresh' //此事件用于改标题(年月)
			}
		}
	},
	//通用方法，设置navigationview的标题
	setViewTitle: function(view, title) {
		if (view && !view.rendered)
			view.config.title = title;
		var main = this.getMain();
		if (!main) return;
		var activeItem = main.getActiveItem(),
			navBar = main.getNavigationBar();
		if (!view || (view && activeItem === view)) {
			if (navBar && main.getInnerItems().length == navBar.backButtonStack.length) {
				var stack = navBar.backButtonStack;
				stack[stack.length - 1] = title;
				navBar.setTitle(title);
			}
		}
		if (view && view.setTitle)
			view.setTitle(title);
	},
	onItemListSelect: function(view, index, target, record, e, eOpts) {
		var it = this,
			main = it.getMain();
		var itemList = it.getItemList();
		var _lpaListView = this.getLpaListView();

		if (!itemList) itemList = Ext.create('EQMS.view.lpa.ItemList');

		var _createDate = record.get('createDate') == null ? Ext.Date.format(new Date(),'Y-m-d H:i:s') : record.get('createDate');
		var _date = util.dateToString(record.get('workDate'));
		var _listSubId = record.get('listId');
		var _groupId = record.get('groupId');
		//区域
		var _field01;
		var _params = {
			userName: $userName,
			date: _date,
			listSubId: _listSubId,
			createDate: _createDate
		}
		var _title = _field01;
		util.storeLoad(itemList, _params, function(records, operation, success) {
			if (record.get('createDate') != null) {
				//console.log("records",records);
				//显示保存的注塑机号
				itemList.down('#molding').setValue(records[0].getData().field04);
			}
		});
		//main.push(itemList);
		if(record.get('createDate') != null && record.get('createDate') != ''){
				_field01= record.get('field01');
				if(_field01 == '注塑'){
					itemList.down('#molding').setHidden(false);
				}
				itemList.setLpaListRecord(record);
				itemList.down('fieldset').setTitle(_field01);
				main.push(itemList);
				return;
			}
			//跳转至带有区域图的界面：包含区域图和一个扫码按钮
			var _items = [
			{
				xtype: 'dataview',
				itemId: 'spectaculars',
				height:'90%',
				width:'100%',
				inline:true,
				selectedCls:'x-item-selected',
				store: {
					type: 'spectaculars',
		            model: 'EQMS.model.lpa.Spectaculars',
					storeId: 'spectaculars'
				},
				fullscreen: true,
				itemTpl: [
					'<div>',
						'<div class = "square-icon round" style="{[((values.name == \'注塑\' || values.name == \'外仓(含IQC)\' || values.name == \'电子仓+成品仓\') || values.isAudit == 0 )? \'background: #9E9E9E;\' : \'background: #2fd12a;\']}">{name}',
						'</div>',
					'</div>'
				].join(''),
				listeners:{
					initialize:function(){
						//console.log(1234567);
					},
					itemtap:function( dataview, index1, target2, record2, e1, eOpts ){
						if(record2.get('isAudit') == 1){
						//record.get('stepNum') == 4 && (
							if(record2.get('name') == '注塑' || record2.get('name') == '电子仓+成品仓' || record2.get('name') == '外仓(含IQC)'){
								//console.log(123333333);
							}else{
								Ext.toast("区域已审核", 5000);
								return;
							}
						}
						//console.log(12345678);
						util.qrcodeScan(function(result) {
								var arr = [];
								var arr = result.split(",");
								//这里写逻辑
								//对返回的的数据进行匹配。日期和当天日期相同
								/*if(record.get('stepNum') == 4){
									if ((Ext.util.Format.date(new Date(), 'Y-m-d') == Ext.util.Format.date(arr[0], 'Y-m-d')) && (arr[1] == record.get('field01'))){
											itemList.down('fieldset').setTitle(record.get('field01'));
											if(_field01 == '注塑'){
												itemList.down('#molding').setHidden(false);
											}
											itemList.setLpaListRecord(record);
											main.push(itemList);
											actionSheet.destroy();
										} else {
											Ext.toast("您的信息有误或选择的区域有误！！！", 5000);
									}
								}else{*/
									if (Ext.util.Format.date(new Date(), 'Y-m-d') == Ext.util.Format.date(arr[0], 'Y-m-d')){
											if(arr[1] == record2.get('name')){
												record.set('field01',arr[1]);
												_field01= record.get('field01');
												itemList.down('fieldset').setTitle(_field01);
												if(_field01 == '注塑'){
													itemList.down('#molding').setHidden(false);
												}
												itemList.setLpaListRecord(record);
												main.push(itemList);
												actionSheet.destroy();
											}else{
												Ext.toast("您选择的区域有误！", 5000);
											}
										}else{
											Ext.toast("您的信息有误！！！", 5000);
									}
								//}
							});
					}
				}
			},
			{
				xtype: 'fieldset',
				docked: 'bottom',
				items: [{
					xtype: 'button',
					text: '返回',
					style: {
						'background':'rgba(160,191,124,1)',
						'font-size': '1.7em'},
					listeners: {
						tap: function() {
							actionSheet.destroy();
						}
					}
				}]
			}];
			var actionSheet = Ext.create('Ext.ActionSheet', {
				cls: 'spectaculars',
				items: _items,
				listeners:{
					initialize:function(ac){
						//console.log(ac);
						//ac.addCls('actionsheetspectaculars');
						// console.log(987654);
						var it = this;
						var spectaculars = it.down('#spectaculars');
						var params = {
							userName: $userName,
							workDate: _date,
							groupId: _groupId
						};
						util.storeLoad(spectaculars,params);
						/*var it = this;
						var _field02 = [{
							field01: 'PC6',
							isShow:'0'
						},
						{
							field01: 'PC16',
							isShow:'1'
						}];
						var _field03 = [{
							field01: 'PC6',field02: 'PC16'
						}];
						var spectaculars = it.down('#spectaculars');
						spectaculars.setData({
							field01:_field01
						});
						//spectaculars.setData(_field03);
						var spectaculars = it.down('#spectaculars');
						var params = {
							userName: $userName,
							workDate: _date,
							groupId: _groupId
						};
						util.storeLoad(spectaculars,params);
						//it.callParent(arguments);
						it.down('#spectaculars').element.on({  
			                  tap : function(com, e, eOpts) {
			                  var action = com.target.getAttribute('action');
			                	  console.log("action",action);  
			                    alert("你点击了panel"+"第"+action+"个");  
			                  },  
			                  touchstart:function(){  
			                    console.log("touch start......");  
			                  },  
			                  touchend:function(){  
			                    console.log("touch end......");  
			                  }  
		             	});*/
					}
				}
			});
			Ext.Viewport.add(actionSheet);
	},
	onCalendarRefresh: function(calendarview, date) {
		//console.log(this.getLpaListView().getStore());
		var t = Ext.Date.format(date, "Y年n月");
		this.setViewTitle(calendarview.up('view2'), t);
	},
	onActivate: function(view) {
		//view.destroy();
		//view.show();
		console.log(77777);
		var calendar = view.down('calendar'),
			calview = calendar.getActiveItem(),
			dateRange = calview.getPeriodMinMaxDate();
		calendar.fireEvent('refresh', calendar, calview.getBaseDate()); //改标题(年月)
		calendar.fireEvent('periodchange', calendar, dateRange.min.get('date'), dateRange.max.get('date'), 'none');
	},
	onSelChange: function(calendarview, newDate, prevDate) {
		 console.log("newDate",newDate);
		var _this = this;
		var _params = {
			auditDate: util.dateToString(newDate),
			auditID: $userName
		}
		//console.log("_params",_params);
		var _lpaListView = _this.getLpaListView();
		if(!_lpaListView) _lpaListView = Ext.create('EQMS.view.lpa.LpaList');
		_this.storeLoad(_lpaListView, _params);
		//console.log(_lpaListView.getStore());
	},
	onPeriodChange: function(calendar, start, end) {
		//calendar.setHidden(true);
		//calendar.show();
		//console.log(calendar.getActiveItem());
		var _date = util.dateToString(calendar.getActiveItem().getBaseDate());
		var _month = _date.substring(0, 7);
		//console.log(_month);
		var _params1 = {
			month: _month,
			userName: $userName
		};
		var url = 'lpa/getCalendarData';
		//console.log("test")
		util.myAjax(url, _params1, function(response, request) {
			var _data = Ext.decode(response.responseText).data;
			//修复日历滑动真机BUG。每月每天的EventId都要不一样
			_data.forEach(function(item,index){
				item.EventId = item.EventId + Math.round(Math.random()*100000);
			});
			Ext.getStore('calendar').setData(_data);			
		});
	},
	//加载stroe
	storeLoad: function (list, params, callback) {
		// console.log(12345);
		var store = list.getStore();
		if (params) {
			store.setProxy({
				extraParams: params
			});
		} else if (store.getCount() > 0) {
			return
		}
		store.loadPage(1, {
			callback: function (records, operation, success) {
				if (records.length == 0) {
					list.setEmptyText('没有获取到内容');
				}
				if(callback){
					callback(records, operation, success)
				}
			},
			scope: this
		});
	}
});