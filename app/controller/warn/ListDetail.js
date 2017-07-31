Ext.define('EQMS.controller.warn.ListDetail',{
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			main: 'main',
			home: 'home',
			warnList: 'warnList',
			listDetail: 'listDetail',
			saveBtn: 'listDetail [action=save]',
			dealBtn: 'listDetail [action=deal]'
		},
		control: {
			listDetail:{
				tapcancel: 'onTapCancel'
			},
			saveBtn:{
				tap: 'onTapSave'
			},
			dealBtn:{
				tap: 'onDealBtnTap'
			}
		}
	},
	onDealBtnTap: function(btn, e, opt){//消警
		var me = this;
		var _listDetail = this.getListDetail();
		var _warnRecord = _listDetail.getWarnRecord();
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
					docked: 'top',
					xtype: 'toolbar',
					title: '账 号 登 陆'
				},
				{
					xtype: 'fieldset',
					width: '75%',
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
						}
					]
				},
				{
					xtype: 'button',
					width: '75%',
					ui: 'blue',
					margin: '1em 0 0 0',
					text: '确 认 消 警',
					handler: function(){
						me.onConfirmDeal(_login, _warnRecord);
					}
				},
				{
					xtype: 'button',
					width: '75%',
					margin: '1em 0 0 0',
					iconCls: 'qrcode',
	                ui: 'blue', 
	                text: '扫 码 消 警',
					handler: function(){
						util.qrcodeScan(function(result){
							console.log("qrcodeScan",result);
							//这里写消警逻辑
							me.onScanDeal(_login, _warnRecord,result);
						});
					}
				}
			],
			scrollable: null
		});
		Ext.Viewport.add(_login);
	},
	onScanDeal:function(view, record, str){
		var it = this;
		var _userName = str;
		var _params = {
			userName : _userName
		};
		var url = 'eqms/checkUser';
		//判断人员账号是否正确
		util.myAjax(url, _params, function(response, request){
			var obj = Ext.decode(response.responseText).data;
			//if(obj.length > 0){
				//判断消警人是否是报警人
				var url1 = 'andon/saveComplete';
				var _params1 = {
					warnListId: record.get("id"),
					userName : _userName
				}
				
				util.myAjax(url1, _params1, function(response, request){
					var _data = Ext.decode(response.responseText);
					// console.log(_data);
					if(_data.success == 1){
						it.getWarnList().getStore().load();
						Ext.toast("消警成功");
						view.destroy();
						it.getMain().pop();
					}else{
						Ext.toast(_data.message);
					}
				});
			/*}else{
				Ext.toast('输入用户名或密码错误!');
			}*/
		});
	},
	onConfirmDeal: function(view, record){ //确认消警
		var it = this;
		var _values = view.getValues();
		var _userName = _values.userName;
		var _pwd = _values.pwd;
		var _params = {
			userName : _userName,
			pwd: _pwd
		};
		var url = 'eqms/login';
		//判断人员账号是否正确
		util.myAjax(url, _params, function(response, request){
			var obj = Ext.decode(response.responseText).data;
			if(obj.length > 0){
				//判断消警人是否是报警人
				var url1 = 'andon/saveComplete';
				var _params1 = {
					warnListId: record.get("id"),
					userName : _userName
				}
				
				util.myAjax(url1, _params1, function(response, request){
					var _data = Ext.decode(response.responseText);
					// console.log(_data);
					if(_data.success == 1){
						it.getWarnList().getStore().load();
						Ext.toast("消警成功");
						view.destroy();
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
	onTapOk: function(btn, e, opt){ //完成
		var _listDetail = this.getListDetail();
		if(!_listDetail) _listDetail = Ext.create('EQMS.view.warn.ListDetail');
	},
	onTapSave: function(btn, e, opt){//保存
		var it = this;
		var _listDetail = it.getListDetail();
		var _warnRecord = _listDetail.getWarnRecord();
		var model = Ext.create('EQMS.model.warn.ListDetail');
		if(util.valid(model, _listDetail)){
			var url = 'andon/saveListDetail';
			var _params1 = {
				createUser: $userName,
				warnListId: _warnRecord.get('id'),
				problemType: _listDetail.getValues().problemType,
				solution: _listDetail.getValues().solution,
				equipment: _listDetail.getValues().equipment,
				otherSolution: _listDetail.getValues().otherSolution
			}
			
			util.myAjax(url, _params1, function(response, request){
				var _data = Ext.decode(response.responseText).data;
				if(_data.success != 0){
					Ext.toast('保存成功！');
					it.getWarnList().getStore().load();
					it.getMain().pop();
				}else{
					Ext.toast(_data.message);
				}
			});
		}
	},
	onTapCancel: function(btn, e, opt){//撤销接警
		var it = this;
		var _listDetail = this.getListDetail();
		var _warnRecord = _listDetail.getWarnRecord();
		Ext.Msg.confirm( '提示', '是否确认撤销接警？', function(buttonId, value ,opt){
			if(buttonId == 'yes'){
				var url = 'andon/cancelReceiveWarn';
				var _params1 = {
					warnListId: _warnRecord.get('id')
				}
				
				util.myAjax(url, _params1, function(response, request){
					var _data = Ext.decode(response.responseText);
					if(_data.success == 1){
						Ext.toast("接警已经取消");
						it.getWarnList().getStore().load();
						it.getMain().pop();
					}else{
						Ext.toast(_data.message);
					}
				});
			}
		});
	}
});