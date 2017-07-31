Ext.define('EQMS.view.Mine', {
	extend: 'Ext.form.Panel',
	xtype: 'mine',
	required: [
		'UX.field.SettingItem'
	],
	config:{
		cls: 'mine',
		layout: {
            type: 'vbox'
        },
        defaults: {
            margin: '.4em'
        },
		items: [
			{
				xtype: 'profile',
				height: 190,
				margin: 0
			},{
				xtype: 'fieldset',
				defaults: {
					labelWidth: 'auto'
				},
				items: [{
					xtype: 'settingitem',
					name: 'setting',
					label: '程序设置'
				}]
			}, {
				xtype: 'fieldset',
				reference: 'fs2',
				defaults: {
					labelWidth: 'auto'
				},
				items: [
				{
					xtype: 'settingitem',
					name: 'clearcache',
					label: '清空缓存',
					listeners: {
                    	disclose: function(si, record, target, index, e, eOpts){
                    		util.removeLsItem('listId');
                    	}
                	}
				},
				{
					xtype: 'settingitem',
					name: 'about',
					label: '关于'
				}
				]
			},
			{
				xtype: 'button',
				ui: 'red',
				itemId: 'exit',
				text: '退 出'
			}
		]
	}
});