Ext.define('EQMS.view.Apps', {
	extend: 'Ext.DataView',
	xtype: 'apps',
	required: [
	],
	config:{
		cls: 'apps',
		inline: true,
		data:[
			// {name: '分层审核', iconColor: 'orangeYellow warnType1', redirectTo: 'redirectTo/demo1'},
			// {name: '产品审核', iconColor: 'roseRed warnType3', redirectTo: 'redirectTo/demo2'},
			// {name: '首检', iconColor: 'orange warnType2', redirectTo: 'redirectTo/demo3'},
			// {name: '巡检', iconColor: 'lightBlue warnType4', redirectTo: 'redirectTo/demo4'},
			// {name: '进检', iconColor: 'green warnType5', redirectTo: 'redirectTo/demo5'},
			// {name: '问题流', iconColor: 'yellow warnType6', redirectTo: 'redirectTo/demo6'},
			{name: '暗灯报警', iconColor: 'roseRed app1', redirectTo: 'warnList'},
			{name: '分层审核', iconColor: 'lightBlue app2', redirectTo: 'lpaList'},
			{name: '巡检', iconColor: 'green app3', redirectTo: 'xjList'}
			//{name: '看板', iconColor: 'green app3', redirectTo: 'panelHref'}
			// {name: '不合格品', iconColor: ''},
			// {name: 'test', iconColor: ''}
		],
		itemTpl: Ext.create('Ext.XTemplate',
			'<div class="icon-wrapper flexbox box-orient-v box-align-center">',
				'<div class="square-icon round {[values.iconColor != null && values.iconColor != \'\' ? values.iconColor : \'color-icon sys\']}"></div>',
				'<div class="short-text ellipsis">{name}</div>',
			'</div>'
			// '<div class="badge">19</div>'   角标
		)
	}
});