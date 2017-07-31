Ext.define('EQMS.controller.Apps', {
	extend: 'Ext.app.Controller',
	requires: [
		'Ext.ActionSheet'
	],
	config: {
		refs: {
			main: 'main',
			home: 'home',
			apps: 'apps'
		},
		control: {
			apps:{
				itemtap:'onItemTap'
			}
		}
	},
	onItemTap: function( list, index, target, record, e, eOpts ){
		var _xtype = record.get('redirectTo');
		if(_xtype =='lpaList'){
			var _view = Ext.widget(record.get('redirectTo'));
			var main = this.getMain();
			main.push(_view);
		}/*else if(_xtype =='panelHref'){
			//window.open(a.href, 'http:101.227.67.70:9999/andeng/andeng.jsp');
			// window.open('http:101.227.67.70:9999/andeng/andeng.jsp'.href, '_system');
			window.location.href = 'http:101.227.67.70:9999/andeng/andeng.jsp';
		}*/
	}
});