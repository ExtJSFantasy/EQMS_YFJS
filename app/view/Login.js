Ext.define('EQMS.view.Login', {
	extend: 'Ext.form.Panel',
	xtype: 'login',
	required: [
		'Ext.field.Text',
        'Ext.field.Password',
        'Ext.field.Checkbox'
	],
	config:{
		cls: 'login-view',
		layout:{
			type: 'vbox',
			align: 'center',
			pack: 'center'
		},
		defaults:{
			margin: '0 0 1em 0'
		},
		items: [
			{
				xtype: 'component',
				cls: 'applogo'
			},
			{
				xtype: 'container',
				width: '75%',
				items:[
					{
						xtype: 'textfield',
						label: ' ',
						// required: true,
						labelWidth: 'auto',
						placeHolder: '用户名',
						name: 'userName',
						//value: '002',
						// value: 'acaoc1',
						cls: 'username'
					},
					{
						xtype: 'passwordfield',
						label: ' ',
						// required: true,
						labelWidth: 'auto',
						name: 'pwd',
						placeHolder: '密码',
						//value: '1234',
						cls: 'password'
					}
				]
			},
			{
				xtype: 'button',
				width: '75%',
				itemId: 'loginBtn',
				text: '登 录',
				ui: 'blue'
			},
			{
                xtype: 'button',
                itemId: 'setHost',
				cls: 'link',
                iconCls: 'setting',
                ui: 'plain',
                text: '帐套设置'
            }, {
                xtype: 'button',
                itemId: 'scanLogin',
                iconCls: 'qrcode',
				cls: 'link',
                ui: 'plain',
                text: '扫一扫登录'
            }
		]
	}
});