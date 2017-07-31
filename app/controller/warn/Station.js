Ext.define('EQMS.controller.warn.Station', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			main: 'main',
			home: 'home',
			warnList: 'warnList',
			warn: 'warn',
			station: 'station'
		},
		control: {
			station:{
				itemsingletap: 'onItemsingletap'
			}
		}
	},
	onItemsingletap: function(dataview, index, target, record, e, eOpts){
		var it = this;
		var _line = util.getLsItem('line');//获取产线缓存
		
		var _login = Ext.create('Ext.form.Panel',{
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
					xtype: 'fieldset',
					width: '90%',
					items: [
						{
							xtype: 'textfield',
							name: 'userName',
							required: true,
							labelWidth: 'auto',
							placeHolder: '账号',
							label: '账号'
						},
						{
							xtype: 'passwordfield',
							name: 'pwd',
							placeHolder: '密码',
							required: true,
							labelWidth: 'auto',
							itemId: 'password',
							label: '密码'
						}/*,
						 {
							xtype: 'selectfield',
							itemId:'selectfield',
							label: '产线',
							name: 'line',
							labelWidth: 'auto',
							displayField: 'lineName',
							value: _line,
							// autoSelect:true, 
							// placeHolder: '请输入产线',
							valueField: 'lineId',
							store: {
								type: 'line',
								storeId: 'line',
								autoLoad:true
							}
						}*/
					]
				},
				{
					xtype: 'button',
					width: '90%',
					ui: 'red',
					margin: '1em 0 0 0',
					text: '确 认 报 警',
					handler: function(){
						it.addWarnList(_login, record);
					}
				},
				{
					xtype: 'button',
					width: '90%',
					ui: 'red',
					margin: '1em 0 0 0',
					text: '扫 码 报 警',
					iconCls: 'qrcode',
					handler: function(){
						it.onQrcode(_login);
					}
				}
			],
			scrollable: null
		});
		Ext.Viewport.add(_login);
	},
	//添加报警信息
	addWarnList: function(_login, record){
		var it = this;
		var _warnRecord = it.getStation().getWarnRecord();

		var _warnTypeId = _warnRecord.get('id'); //报警类型
		var _stationId = record.get('id'); //工位
		var _values = _login.getValues(); 
		//var line = this.getWarn().down('#selectfield').getValue();
		//var _lineId = _values.line; //产线
		var _lineId = this.getWarn().down('#selectfield').getValue(); //产线
		//console.log("_lineId",_login.down('#selectfield'));
		var _createUser = _values.userName; //报警人
		var _pwd = _values.pwd; //密码
		
		//缓存
		util.setLsItem('line', _lineId);
		var _params = {
			userName : _createUser,
			pwd: _pwd
		};
		var url = 'eqms/login';

		util.myAjax(url, _params, function(response, request){
			var obj = Ext.decode(response.responseText).data;
			if(obj.length > 0){
				var url1 = 'andon/addWarnList';
				var _params1 = {
					warnTypeId: _warnTypeId,
					stationId: _stationId,
					createUser: _createUser,
					lineId: _lineId
				}
				
				util.myAjax(url1, _params1, function(response, request){
					var _data = Ext.decode(response.responseText);
					if(_data.success == 1){
						//删除warn
						var _innerItems = it.getMain().getInnerItems();
						_innerItems[_innerItems.length - 1].hide();
						it.getMain().remove(_innerItems[_innerItems.length - 1]);
						it.getWarnList().getStore().load();
						Ext.toast("已经发出报警，请稍等！");
						_login.destroy();
						it.getMain().pop();
					}else{
						Ext.toast(_data.message);
					}
				});
			}else{
				Ext.toast('输入用户名或密码错误!');
			}
		});
	},
	onQrcode: function(_login){ //扫码登录
		util.qrcodeScan(function(result) {
			_login.setValues({
					userName: result
				})
		})
	}
});