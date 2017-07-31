Ext.define('EQMS.view.xj.ItemList', {
	extend: 'Ext.List',
    xtype: 'xjItemList',
    requires: [
		'Ext.form.FieldSet',
		'Ext.form.Select',
		'UX.field.DateTimePicker'
    ],
    config: {
		title : '审核项',
		scrollable: {
            direction: 'vertical',
            directionLock: true
        },
		orient: 'portrait',
		navBtns: [
			{
				action: 'commit',
				text: '提交',
				itemId: 'commit',
				align: 'right'
			}
		],
		cls: 'xjItemList',
		xjListRecord: null,
		isSave: 0,
        items: [
			{
				xtype : 'fieldset',
				title: '',
				layout: 'hbox',
				docked : 'top',
				items:[
					{
						xtype: 'selectfield',
						name: 'classes',
						label: '',
						flex: 1,
						itemId: 'classes',
						placeHolder: '班次',
						valueField: 'text',
						displayField: 'text',
						autoSelect: false,
						options: [
							{text: '早班', value: '早班'},
							{text: '晚班', value: '晚班'}
						]
					},{
						xtype: 'datetimepickerfield',
						name: 'checkTime',
						itemId: 'checkTime',
						dateFormat: 'H:i',
						picker:{
							useTitles: true,
							minuteInterval: 1,
							hourText: '时',
							minuteText: '分',
							slotOrder: ['hour', 'minute']
						},
						value: new Date(),
						label: '',
						flex: 1,
						placeHolder: '检查时间',
						required: true
					}
				]
			}
		],
		variableHeights: true,
		// emptyText : '没有数据',
		scrollToTopOnRefresh: false,
		store: {
			type: 'xjItemList',
			storeId: 'xjItemList'
		},
		grouped: true,
		itemTpl: [
			'<div class="flexbox box-align-center"> ',
				'<div class="flex10">',
					'<h3 class="item">',
						'{checkList}',
						'<tpl if="isaIndication == \'是\'">',
							'<span style="color: red; font-weight: 700;">【{indication}】</span>',
						'</tpl>',
					'</h3>',
				'</div>',
				'<div class="op">',
					'<tpl if="auditResult == \'ok\'">',
						'<div class="btn list-icon green active ok" action="ok"></div>',
						'<div class="btn list-icon gray other" action="na"></div>',
						'<div class="btn list-icon red nok" action="nok"></div>',
					'</tpl>',
					'<tpl if="auditResult == \'nok\'">',
						'<div class="btn list-icon green ok" action="ok"></div>',
						'<div class="btn list-icon gray other" action="na"></div>',
						'<div class="btn list-icon red active nok" action="nok"></div>',
					'</tpl>',
					'<tpl if="auditResult == \'na\'">',
						'<div class="btn list-icon green ok" action="ok"></div>',
						'<div class="btn list-icon gray active other" action="na"></div>',
						'<div class="btn list-icon red nok" action="nok"></div>',
					'</tpl>',
					'<tpl if="auditResult == null">',
						'<div class="btn list-icon green ok" action="ok"></div>',
						'<div class="btn list-icon gray other" action="na"></div>',
						'<div class="btn list-icon red nok" action="nok"></div>',
					'</tpl>',
				'</div>',
			'</div>'
		].join('')
    }
});