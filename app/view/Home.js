Ext.define('EQMS.view.Home', {
    extend: 'Ext.TabPanel',
    xtype: 'home',
    alternateClassName: 'home',
    config: {
		title: '首页',
		scrollable: {
			direction: 'vertical',
			directionLock: true
		},
		orient: 'portrait',
		tabBarPosition: 'bottom',
		navBtns: [
		],
        cls: 'home',
		defaults: {
			tab: {
				iconAlign: 'top',
				flex: 1
			},
			styleHtmlContent: true
		},
        items: [
			{
				title: '消息',
				iconCls: 'message',
				html: '陆续更新中。。。'
			},
			{
				title: '任务',
				iconCls: 'task',
				html: '陆续更新中。。。'
			},
			{
				title: '应用',
				iconCls: 'app',
				xtype: 'apps'
			},
			{
				title: '我的',
				iconCls: 'user',
				xtype: 'mine'
			}
		]
    },
	initialize: function(){
		this.callParent(arguments);
		this.setActiveItem(2);
	}
});