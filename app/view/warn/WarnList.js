Ext.define('EQMS.view.warn.WarnList',{
	extend: 'Ext.List',
	xtype: 'warnList',
	requires:[
		'UX.tab.LineBar',
		'Ext.plugin.PullRefresh',
		'Ext.plugin.ListPaging'
	],
	config:{
		title: '报警单',
		scrollable: {
			direction: 'vertical',
			directionLock: true,
			indicators: false  //隐藏滚动条
		},
		orient: 'portrait',
		cls: 'warnList',
		variableHeights: false,
		canSwipeback: false,
		store: {
			type: 'warnList',
			storeId: 'warnList'
		},
		plugins: ['pullrefresh', 'listpaging'],
		itemTpl: Ext.create('Ext.XTemplate',
			'<div>',
				'<h4 class="flexbox listPadding bottomLine {[values.active == 0 ? \'\' : (values.active == 2 ? \'yellow\' : (values.active == 4 ? \'grey\' : \'green\'))]}">',
					'<div class="from flex1 ellipsis">{status}&nbsp;&nbsp;<span class="date">{[Ext.Date.format(values.createDate, "Y-m-d H:i:s")]}</span></div>',
					'<div class="delete" action="delete"></div>',
				'</h4>',
				'<div class="flexbox box-align-center listPadding">',
					'<div class="avatar firstletter {[values.warnType == null || values.warnType == \'\' ? \'color-icon system\' : values.warnType]}" letter="{[this.isAudit(values.warnTypeName)]}"></div>',
					'<div class="flex10">',
						'<h3 class="flexbox line">',
							'<div class="flex1 from ellipsis">{station}</div>',
							'<span class="date1">{[this.toHourMinute(values.totalHours)]}</span>',
						'</h3>',
						'<h4 class="flexbox">',
							'<div class="flexbox box-align-center flex1 ellipsis fontColor">{status2}</div>',
							'<span class="date">{[values.date2 == null || values.date2 == \'\' ? \'\' : Ext.Date.format(values.date2, "H:i:s")]}&nbsp;&nbsp;({date2Length})</span>',
						'</h4>',
						'<h4 class="flexbox">',
							'<div class="flexbox box-align-center flex1 ellipsis fontColor">{status3}</div>',
							'<span class="date">{[values.date3 == null || values.date3 == \'\' ? \'\' : Ext.Date.format(values.date3, "H:i:s")]}&nbsp;&nbsp;({date3Length})</span>',
						'</h4>',
						'<h4 class="flexbox">',
							'<div class="flexbox box-align-center flex1 ellipsis fontColor">报警人:{createUser}</div>',
							'<span class="date">类型: {warnTypeName}</span>',
						'</h4>',
					'</div>',
				'</div>',
				'<div class="op">',
					'<div class="btn list-icon list" action="list">维修履历</div>',
					'<div class="btn list-icon option" action="option">{[values.active == 0 ? \'响应\' : (values.active == 2 ? \'待处理\' : (values.active == 4 ? \'待消警\' : \'已完成\'))]}</div>',
				'</div>',
			'</div>',
			{
				isAudit: function(station){
					return station = station.substring(0,2);
				}
			},
			{
				toHourMinute:function(minutes){
					//Math.floor(x)返回小于参数x的最大整数
			  		return (Math.floor(minutes/60) + "小时" + (minutes%60) + "分" );
				}	
			}
		),
		navBtns: [
			{
				action: 'lineId',
				text: '选择产线',
				//hidden:true, 
				itemId: "lineId",
				listeners:{
					show:function( btn, eOpts ){
						console.log(765434);
						var _lineName = util.getLsItem('lineName');
						if(_lineName == null){
							return;
						}
						btn.setText(_lineName);
						//this.setHidden(true);
					}
				}
			}],
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
						text: '未完成'
					}, {
						value: 'nok1',
						text: '已处理'
					},{
						value: 'ok',
						text: '已完成'
					}]
				}
			},
			{
				xtype: 'button',
				text: '',
				iconCls: 'plus white',
				cls: 'newBtn',
				ui: 'action',
				action: 'new'
			}
		]
	},
	initialize: function(){
		this.callParent(arguments);
		console.log("line----->: ",util.getLsItem('lineId'));
		util.storeLoad(this, {status: '未完成', createUser: '002'});
	}
});