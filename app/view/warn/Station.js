Ext.define('EQMS.view.warn.Station',{
	extend: 'Ext.DataView',
	xtype: 'station',
	config:{
		warnRecord: null,
		title: '工位',
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
			type: 'warnStation',
			storeId: 'warnStation'
		},
		itemTpl: Ext.create('Ext.XTemplate',
			 '<div class="icon-wrapper flexbox box-orient-v box-align-center">',
			 	//'<div class="square-icon round {[values.iconColor != null && values.iconColor != \'\' ? values.iconColor : \'color-icon sys\']}" letter="{[this.isAudit(values.name)]}" ></div>',
			 	'<div class="square-icon round {[values.iconColor != null && values.iconColor != \'\' ? values.iconColor : \'color-icon sys\']}" letter="{name}" ></div>',
			 '</div>',
			 //'<div class="short-text ellipsis">{name}</div>',
			// '<div class="badge">19</div>'   角标，
			{
				isAudit: function(name){
					return name = name.substring(0,2);
				}
			}
		)
	}
});