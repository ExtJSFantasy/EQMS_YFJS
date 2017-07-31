Ext.define('EQMS.view.Main', {
	extend : 'UX.navigation.View',
    // extend : 'Ext.navigation.View',
	xtype : 'main',
	config : {
		cls: 'main',
		autoDestroy : true,
		defaultBackButtonText: "返回",
		items : [
			{
				xtype : 'home'
			}
		]
	}
});
