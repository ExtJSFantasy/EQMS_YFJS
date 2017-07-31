/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/
Ext.Loader.setPath('UX', 'app/ux');
Ext.application({
    name: 'EQMS',

    requires: [
        'Ext.MessageBox',
		'Ext.field.Password',
		'Ext.Toast',
		'EQMS.util',
		'UX.field.SettingItem',
		'UX.TouchCalendar',
		'UX.TouchCalendarSimpleEvents',
		'UX.TouchCalendarView'
    ],
	
	controllers: [
		'Login',
		'HostMgr',
		'Home',
		'Apps',
		'Mine',
		'warn.Warn',
		'warn.Station',
		'warn.WarnList',
		'warn.ListDetail',
		'lpa.LpaList',
		'lpa.ItemList',
		'lpa.ItemDetail',
		'xj.List',
		'xj.ItemList',
		'xj.ItemDetail'
	],

    views: [
        'Main',
		'Login',
		'HostMgr',
		'Home',
		'Mine',
		'Profile',
		'Apps',
		'warn.Station',
		'warn.Warn',
		'warn.WarnList',
		'warn.ListDetail',
		'lpa.LpaList',
		'lpa.ItemList',
		'lpa.ItemDetail',
		'xj.List',
		'xj.ItemList',
		'xj.ItemDetail',
		'Href'
    ],
	
	models: [
		'Host',
		'User',
		'Calendar',
		'warn.WarnList',
		'warn.Warn',
		'warn.Station',
		'warn.Equipment',
		'warn.Solution',
		'warn.ProblemType',
		'warn.ListDetail',
		'warn.Line',
		'lpa.LpaList',
		'lpa.ItemList',
		'lpa.ItemDetail',
		'lpa.Part',
		'lpa.Station',
		'lpa.ResDepartment',
		'lpa.Spectaculars',
		'xj.List',
		'xj.ItemList',
		'xj.ItemDetail'
	],

	stores: [
		'Abstract.Store',
		'Hosts',
		'warn.WarnList',
		'warn.Warn',
		'warn.Station',
		'warn.Equipment',
		'warn.Solution',
		'warn.ProblemType',
		'warn.Line',
		'lpa.LpaList',
		'lpa.ItemList',
		'lpa.Part',
		'lpa.Station',
		'lpa.ResDepartment',
		'lpa.Spectaculars',
		'xj.List',
		'xj.ItemList'
	],

    icon: {
    },

    isIconPrecomposed: true,

    startupImage: {
    },

    launch: function() {
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();
		util.inIt();
        // Initialize the main view
        Ext.Viewport.add(Ext.create('EQMS.view.Login'));
        
        //自动更新检测
        //if(window.plugins && plugins.update) {
        	console.log(12345678);
        	util.updateAndroid(true);
       // }
       
	},
    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
