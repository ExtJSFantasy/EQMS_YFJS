Ext.define('EQMS.controller.Mine', {
	extend: 'Ext.app.Controller',
	requires: [],
	config: {
		refs: {
			main: 'main',
			mine: 'mine',
			exitBtn: 'mine [itemId=exit]'
		},
		control: {
			exitBtn: {
				tap: 'onExitBtn'
			}
		}
	},
	onExitBtn: function(btn, e, opt) {
		var text = btn.getText();
		/*btn.setText('正在注销...').setDisabled(true);
		Ext.Viewport.removeAll(true, false);
		var login = Ext.widget('login');
		Ext.Viewport.setActiveItem(login);*/
		var _exit = Ext.create('Ext.form.Panel', {
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
			width: Ext.filterPlatform('ie10') ? '100%' : (Ext.os.deviceType == 'Phone') ? 200 : 330,//400
			height: Ext.filterPlatform('ie10') ? '30%' : Ext.os.deviceType == 'Phone' ? 130 : 200,//400
			items: [{
				docked: 'top',
				xtype: 'toolbar',
				title: '退 出 应 用'
			}, {
				xtype: 'fieldset',
				width: '75%',
				layout: 'hbox',
				items: [{
					xtype: 'button',
					width: '45%',
					flex:1,
					ui: 'blue',
					text: '确定',
					handler: function(btn) {
						btn.setText('正在注销...').setDisabled(true);
						Ext.Viewport.removeAll(true, true);
						//Ext.widget('main').removeAll(true,true);
						var login = Ext.widget('login');
						Ext.Viewport.setActiveItem(login);
						_exit.destroy();
					}
				}, {
					xtype: 'button',
					width: '45%',
					flex:1,
					margin: '0px 0px 0px 2px',
					ui: 'blue',
					text: '取消',
					handler: function() {
						_exit.destroy();
					}
				}]
			}],
			scrollable: null
		});
		Ext.Viewport.add(_exit);
		/*var it = this;
		var _items = [{
			text: '退出',
			ui: 'decline',
			handler: function() {
				btn.setText('正在注销...').setDisabled(true);
				Ext.Viewport.removeAll(true, false);
				var login = Ext.widget('login');
				Ext.Viewport.setActiveItem(login);

				actionSheet.destroy();
				console.log('viewport destroy--->: ', Ext.Viewport.getInnerItems());
			}
		}, {
			text: '取消',
			handler: function() {
				actionSheet.destroy();
			}
		}];
		var actionSheet = Ext.create('Ext.ActionSheet', {
			items: _items,
			hideOnMaskTap: true
		});

		Ext.Viewport.add(actionSheet);
		actionSheet.show();*/
	}
});