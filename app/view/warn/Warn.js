Ext.define('EQMS.view.warn.Warn',{
	extend: 'Ext.DataView',
	xtype: 'warn',
	config:{
		title: '报警类型',
		scrollable: {
			direction: 'vertical',
			directionLock: true
		},
		orient: 'portrait',
		cls: 'demo2',
		variableHeights: false,
		// scrollable: false,
		inline: { wrap: false },
		store:{
			type: 'warn',
			storeId: 'warn'
		},
		itemTpl: Ext.create('Ext.XTemplate',
			'<div class="icon-wrapper flexbox box-orient-v box-align-center">',
				//'<div class="square-icon round {[values.iconColor != null && values.iconColor != \'\' ? values.iconColor : \'color-icon sys\']}"></div>',
			 	//'<div class="square-icon round {[values.iconColor != null && values.iconColor != \'\' ? values.iconColor : \'color-icon sys\']}" letter="{[this.isAudit(values.name)]}" ></div>',
			 	'<div class="square-icon round {[values.iconColor != null && values.iconColor != \'\' ? values.iconColor : \'color-icon sys\']}" letter="{name}" ></div>',
			 '</div>',
			 //'<div class="short-text ellipsis">{name}</div>',
			// '<div class="badge">19</div>'   角标,
			{
				isAudit: function(name){
					return name = name.substring(0,2);
				}
			}
		),
		items:[
			{
				xtype:'fieldset',
				items:[
					{
						xtype: 'selectfield',
						itemId:'selectfield',
						label: '产线:',
						docked:'top',
						name: 'line',
						labelWidth: 'auto',
						displayField: 'lineName',
						valueField: 'lineId',
						
						store: {
							type: 'line',
							storeId: 'line',
							autoLoad:true
						}
					}
				]
			}
		]
	}
});