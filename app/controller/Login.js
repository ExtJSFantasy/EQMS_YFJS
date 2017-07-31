Ext.define('EQMS.controller.Login', {
	extend: 'Ext.app.Controller',
	requires: [],
	config: {
		refs: {
			loginView: 'login',
			hostMgr: 'hostMgr',
			loginBtn: 'login [itemId=loginBtn]',
			setHostBtn: 'login [itemId=setHost]',
			scanLoginBtn: 'login [itemId=scanLogin]'
		},
		control: {
			loginBtn: {
				tap: function(t, value) {
					var login = this.getLoginView();
					// console.log(login.getValues());

					var model = Ext.create('EQMS.model.User');
					if (util.valid(model, login)) {
						this.onLogin(login);
					}
				}
			},
			setHostBtn: { //切换账套
				tap: 'onSetHostTap'
			},
			scanLoginBtn: { //扫描二维码账号
				tap: 'onScanLoginTap'
			}
		}
	},
	onSetHostTap: function(t, value) {
		console.log("切换账号");
		var hostMgr = this.getHostMgr();
		if (!hostMgr) hostMgr = Ext.create('EQMS.view.HostMgr');
		Ext.Viewport.add(hostMgr);
		Ext.Viewport.setActiveItem(hostMgr);
	},
	onScanLoginTap: function(t, value) {
		console.log("扫码");
		var it = this;
		var login = it.getLoginView();
		var main = Ext.widget('main');
		util.qrcodeScan(function(result) {
			console.log("qrcodeScan", result);
			if (result == null) return;
			//在这里处理扫码获得的信息
			
			//var _username = '002';
			var _username = result;
			var _params = {
				userName: _username
			};
			var url = 'eqms/checkUser';
			console.log(12345678);
			util.myAjax(url, _params, function(response, request) {
				console.log(765432);
				Ext.Viewport.add(main);
				Ext.Viewport.setActiveItem(main);
				login.destroy();
				Ext.toast('登陆成功!');
			})
		})
	},
	onLogin: function(view) {
		var it = this;
		var _username = view.getValues().userName;
		var _password = view.getValues().pwd;

		var _params = {
			userName: _username,
			pwd: _password
		};
		//要区别是暗灯还是分层审核
		//console.log("util.readSettings()",util.readSettings()['host'].indexOf("EQMS1") != -1);
		//测试用的
		// if(util.readSettings()['host'].indexOf("EQMS1") != -1){
		// 	var url = 'eqms/login';
		// }else if(util.readSettings()['host'].indexOf("EQMS") != -1){
		// 	var url = 'eqms/login';
		// }
		var url = 'eqms/login';
		util.myAjax(url, _params, function(response, request) {
			var obj = Ext.decode(response.responseText).data;
			if (obj.length > 0) {
				$userName = obj[0].userName;
				$userDescription = obj[0].userDescription;
				//var main = Ext.widget('main');
				var main = Ext.widget('main');
				//缓存
				var prop = obj[0];
				for (var i in prop) {
					util.changeSetting(i, prop[i])
				}

				//Ext.Viewport.add(main);
				Ext.Viewport.setActiveItem(main);
				view.destroy();
				Ext.toast('登陆成功!');
			} else {
				Ext.toast('输入用户名或密码错误!');
			}
		});
	}
});