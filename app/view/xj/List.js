Ext.define('EQMS.view.xj.List',{
	extend: 'Ext.List',
	xtype: 'xjList',
	requires:[
		'UX.tab.LineBar'
	],
	config:{
		title: '审核清单',
		scrollable: {
			direction: 'vertical',
			directionLock: true,
			indicators: false  //隐藏滚动条
		},
		orient: 'portrait',
		cls: 'xjList',
		variableHeights: false,
		canSwipeback: false,
		store: {
			type: 'xjList',
			storeId: 'xjList'
		},
		// plugins: ['pullrefresh', 'listpaging'],
		itemTpl: Ext.create('Ext.XTemplate',
			'<div class="flexbox box-align-center">',
				'<div class="flex10">',
					'<h3 class="item">',
						'{listName}',
					'</h3>',
				'</div>',
				'<tpl if="nokNum != null">',
					'<div class="op">',
						'<div class="btn">{auditorName}</div>',
						'<div class="btn">{totalNum}</div>',
						'<div class="btn">',
							'<tpl if="nokNum != 0">',
								'<span style="color: red;">{nokNum}</span>',
							'</tpl>',
							'<tpl if="nokNum == 0">',
								'{nokNum}',
							'</tpl>',
						'</div>',
					'</div>',
				'</tpl>',
			'</div>'
		),
		items: [
			{	
				xtype: 'linetabbar',
				// scrollDock: 'top',
				scrollable: null,
				itemId: 'linetabbar',
				docked: 'top',
				itemTpl: '{text}',
				store: {
					autoDestroy: true,
					data: [{
						value: 'nok',
						text: '巡检清单'
					}, {
						value: 'ok',
						text: '已完成'
					}]
				}
			}
		]
	}
});