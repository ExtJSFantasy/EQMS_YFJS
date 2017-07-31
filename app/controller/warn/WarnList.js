Ext.define('EQMS.controller.warn.WarnList', {
	extend: 'Ext.app.Controller',
	requires: [
		'UX.plugin.ImageViewer'
	],
	config: {
		refs: {
			main: 'main',
			home: 'home',
			warnList: 'warnList',
			listDetail: 'listDetail',
			warn: 'warn',
			selectLineBtn:'main [itemId=lineId]',
			lineBar: ' warnList [itemId=linetabbar]',
			newBtn: ' warnList [action=new]'
		},
		control: {
			warnList: {
				itemtap: 'onItemTap'
			},
			lineBar: {
				itemsingletap: 'onLineBar'
			},
			newBtn: {
				tap: 'onNewBtn'
			},
			selectLineBtn:{
				tap: 'onSelectLineBtn'
			}
		}
	},
	onSelectLineBtn:function(){
			var main = this.getMain();
			var warnList = this.getWarnList();

			if(!main) main = Ext.widget('main');
			var lineName = main.down('#lineId');

			if(!warnList) warnList = Ext.widget('warnList');
			console.log("selectfield",Ext.ComponentQuery.query('selectfield'));
			var linetabbarText = warnList.down('linetabbar').selected.items[0].getData().text;

			console.log("linetabbarText",linetabbarText);
			console.log("linetabbarText",linetabbarText);
			var lineId = util.getLsItem('lineId');
			var store = warnList.getStore();
				//store.setModel({lineName:'NA'});
				//store.load();
			/*var _panel = Ext.create('Ext.form.Panel',{
				layout:{
					align: 'center',
					pack: 'center'
				},
				centered: true,
				//cls: 'select',
				width: Ext.filterPlatform('ie10') ? '100%' : (Ext.os.deviceType == 'Phone') ? 260 : 400,
				height: Ext.filterPlatform('ie10') ? '30%' : Ext.os.deviceType == 'Phone' ? 230 : 400,*/
				var _items = [
				{
					xtype: 'selectfield',
					id:'selectfield',
					label: '产线:',
					docked:'top',
					name: 'line',
					labelWidth: 'auto',
					displayField: 'lineName',
					valueField: 'lineId',
					store: {
						type: 'line',
						storeId: 'line',
						autoLoad:true
					},
					listeners: {
						change: function(selectfield, newValue, oldValue, eOpts) {
							console.log("selectfield1234",selectfield.getStore().add({lineName:'NA'}));
							//oldValue = 'test';
							if(oldValue == null){
								return;
							}
							console.log("newValue",newValue);
							console.log("oldValue",oldValue);
							var _lineName = selectfield.getComponent().getValue();
							console.log("newValue",selectfield.getComponent().getValue());
							console.log("newValue",selectfield.getValue('lineName'));
							lineName.setText(_lineName);
							util.setLsItem('lineId', newValue);
							util.setLsItem('lineName', _lineName);
							store.setProxy({
								extraParams: {
									status: linetabbarText,
									createUser: '002'
								}
							});
							store.load();
							store.clearFilter();
							//添加根据产线过滤
							//增加的排序方法
							store.sort([
							    {
							        property : 'createDate',
							        direction: 'DESC'
							    }
							]);
							var lineId = util.getLsItem('lineId');
							console.log('line',lineId);
							if(lineId == null){
								return;
							}
							store.filterBy(function(record) {
								return record.get('lineId') == lineId;
							});
							actionSheet.destroy();
						}
					}
				}
			]
		//});
		var actionSheet = Ext.create('Ext.ActionSheet', {
			items:_items
		});
		Ext.Viewport.add(actionSheet);
	},
	onLineBar: function(dv, index, target, record, e, eOpts) {
		console.log(45389797394);
		console.log("record.get('text')",record.get('text'));
		var _warnList = this.getWarnList();
		if (!_warnList) _warnList = Ext.widget('warnList');
		var store = _warnList.getStore();
		//如何消去第一次进来就是按报警类型，我觉得需要把报警名称传过去
		store.setProxy({
			extraParams: {
				status: record.get('text'),
				createUser: '002'
			}
		});
		store.load();
		//解除过滤
		store.clearFilter();
		//添加根据产线过滤
		//增加的排序方法
		store.sort([
		    {
		        property : 'createDate',
		        direction: 'DESC'
		    }
		]);

		//测试
		/*var s1 = "2017-1-06,PC6";
		var arr = [];
		var arr = s1.split(","); 
		console.log("arr",arr);*/

		var lineId = util.getLsItem('lineId');
		console.log('line',lineId);
		if(lineId == null){
			return;
		}
		store.filterBy(function(record) {
				return record.get('lineId') == lineId;
		});
	},
	onItemTap: function(list, index, target, record, e, eOpts) {
		var it = this;
		var action = e.target.getAttribute('action');
		var _warnList = it.getWarnList();
		// console.log(action);
		if (action == 'delete') {
			if (record.get("active") > 0) {
				Ext.toast("该报警已被接警，不能删除，请确认！");
			} else {
				Ext.Msg.confirm('提示', '是否确认删除？', function(buttonId, value, opt) {
					if (buttonId == 'yes') {
						var url = 'andon/delWarnList';
						var _params1 = {
							warnListId: record.get('id')
						}

						util.myAjax(url, _params1, function(response, request) {
							var _data = Ext.decode(response.responseText);
							if (_data.success == 1) {
								Ext.toast("删除成功！");
								util.storeLoad(_warnList, {
									status: '未完成',
									createUser: '002'
								});
							} else {
								Ext.toast(_data.message);
							}
						});
					}
				});
			}

		} else if (action == 'option') {
			var listDetail = it.getListDetail();
			if (!listDetail) listDetail = Ext.create('EQMS.view.warn.ListDetail');
			var home = it.getMain();
			listDetail.setWarnRecord(record);

			if (record.get('active') == 0) { //未处理报警
				it.onLoginReceive(record);
			} else { //已接警
				if (record.get('active') == 1 || record.get('active') == 4) {
					var url = 'andon/getListDetail';
					var _params1 = {
						warnListId: record.get('id')
					}

					util.myAjax(url, _params1, function(response, request) {
						var _data = Ext.decode(response.responseText).data;
						listDetail.setValues(_data[0]);
					});

					if (record.get('active') == 1) {
						home.setNavBtnsDisabled(listDetail, ['cancel'], true);

						listDetail.down('button[itemId=save]').setDisabled(true);
						listDetail.down('button[itemId=deal]').setDisabled(true);
					} else {
						listDetail.down('button[itemId=deal]').setDisabled(false);
					}
				} else {
					listDetail.down('button[itemId=deal]').setDisabled(true);
				}

				home.push(listDetail);
			}
		} else if (action == 'list') {
			Ext.toast("待开发");
		}
	},
	onCodeReceive: function(record, home, listDetail) {
		cordova.plugins.barcodeScanner.encode(
			cordova.plugins.barcodeScanner.Encode.TEXT_TYPE,
			record.get('code'),
			function(success) {
				var _code = Ext.create('UX.plugin.ImageViewer', {
					src: success.file,
					listeners: {
						imgTap: function(me) {
							clearInterval(time);
						}
					}
				});
				Ext.Viewport.add(_code);

				var time = setInterval(function() {
					var url = 'andon/getWarnListById';
					var _params1 = {
						warnListId: record.get('id')
					}

					util.myAjax(url, _params1, function(response, request) {
						var _data = Ext.decode(response.responseText).data;
						if (_data.active != 0 && _data.active != null) {
							_code.hide();
							home.push(listDetail);
							clearInterval(time);
						}
					});
				}, 3000);
			},
			function(fail) {
				Ext.toast(fail);
			}
		);
	},
	onLoginReceive: function(record) {
		var me = this;
		var home = this.getMain();
		var listDetail = this.getListDetail();
		var _login = Ext.create('Ext.form.Panel', {
			modal: true,
			layout: {
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
			items: [{
				docked: 'top',
				xtype: 'toolbar',
				title: '账 号 登 陆'
			}, {
				xtype: 'fieldset',
				width: '75%',
				items: [{
					xtype: 'textfield',
					name: 'userName',
					required: true,
					labelWidth: 'auto',
					placeHolder: '账号',
					label: '账号'
				}, {
					xtype: 'passwordfield',
					name: 'pwd',
					placeHolder: '密码',
					required: true,
					labelWidth: 'auto',
					itemId: 'password',
					label: '密码'
				}]
			}, {
				xtype: 'button',
				width: '75%',
				ui: 'blue',
				margin: '1em 0 0 0',
				text: '接 警',
				handler: function() {
					me.onReceiveWarn(_login, record);
				}
			}, {
				xtype: 'button',
				width: '75%',
				margin: '1em 0 0 0',
				iconCls: 'qrcode',
				ui: 'blue',
				text: '扫 码 接 警',
				handler: function() {
					util.qrcodeScan(function(result) {
						console.log("qrcodeScan", result);
						//这里写接警逻辑
						me.onScanWarn(_login, record, result);
					});
				}
			}],
			scrollable: null
		});
		Ext.Viewport.add(_login);
	},
	onScanWarn: function(view, record, str) {
		var home = this.getMain();
		var warnList = this.getWarnList();
		var listDetail = this.getListDetail();
		var model = Ext.create('EQMS.model.User');
		console.log("str",str);
		if (str == null) return;
		var _username = str;
		var _params = {
			userName: _username
		};
		//注意这里的代码
		var url = 'eqms/checkUser';
		util.myAjax(url, _params, function(response, request) {
			var obj = Ext.decode(response.responseText).data;
			//if (obj.length > 0) {
				var url1 = 'andon/receiveWarn';
				var _params1 = {
					warnListId: record.get('id'),
					receiveUserName: _username
				}

				util.myAjax(url1, _params1, function(response, request) {
					var _data = Ext.decode(response.responseText);
					if (_data.success == 1) {
						Ext.toast("接警成功！");
						view.destroy();
						warnList.getStore().load();
						listDetail.down('button[itemId=deal]').setDisabled(true);
						home.push(listDetail);
					} else {
						Ext.toast(_data.message);
					}
				});
			/*} else {
				Ext.toast('输入用户名或密码错误!');
			}*/
		});
	},
	onReceiveWarn: function(view, record) {
		var home = this.getMain();
		var warnList = this.getWarnList();
		var listDetail = this.getListDetail();
		var model = Ext.create('EQMS.model.User');
		if (util.valid(model, view)) {
			var _username = view.getValues().userName;
			var _password = view.getValues().pwd;
			var _params = {
				userName: _username,
				pwd: _password
			};
			var url = 'eqms/login';

			util.myAjax(url, _params, function(response, request) {
				var obj = Ext.decode(response.responseText).data;
				if (obj.length > 0) {
					var url1 = 'andon/receiveWarn';
					var _params1 = {
						warnListId: record.get('id'),
						receiveUserName: _username
					}

					util.myAjax(url1, _params1, function(response, request) {
						var _data = Ext.decode(response.responseText);
						if (_data.success == 1) {
							Ext.toast("接警成功！");
							view.destroy();
							warnList.getStore().load();
							listDetail.down('button[itemId=deal]').setDisabled(true);
							home.push(listDetail);
						} else {
							Ext.toast(_data.message);
						}
					});
				} else {
					Ext.toast('输入用户名或密码错误!');
				}
			});
		}
	},
	onNewBtn: function() {
		var home = this.getMain();
		var warn = this.getWarn();
		if (!warn) warn = Ext.create('EQMS.view.warn.Warn');
		warn.getStore().load();
		home.push(warn);
	}
});