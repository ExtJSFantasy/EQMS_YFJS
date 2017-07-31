Ext.define('EQMS.view.xj.ItemDetail', {
	extend: 'Ext.tab.Panel',
    xtype: 'xjItemDetail',
    requires: [
        'Ext.TitleBar',
		'UX.plugin.ImageViewer',
		'EQMS.view.Camera',
		'Ext.field.Hidden',
		'Ext.field.TextArea',
		'Ext.field.Number',
		'Ext.tab.Panel',
		'Ext.form.FieldSet',
		'UX.plugin.Select',
		'Ext.field.Search'
    ],
    config: {
		title : '不符合项',
		scrollable: {
            direction: 'vertical',
            directionLock: true
        },
		orient: 'portrait',
		navBtns: [
			{
				action: 'save',
				text: '保存',
				itemId: 'save',
				align: 'right'
			}
		],
		cls: 'xjItemDetail',
		xjListRecord: null,
		xjItemListRecord: null,
		xjItemList: null,
		items: [
			{
				title: '当即整改',
				xtype : 'formpanel',
				scrollable: null,
				items : [
					{
						xtype : 'fieldset',
						items:[
							{xtype: 'numberfield', name: 'indication', label: '', placeHolder: '请输入读数', required: true},
							{xtype: 'hiddenfield', name: 'solveMethod', value: 'quickSolve'},
							{xtype: 'hiddenfield', name: 'isNC', value: '0'},
							{xtype: 'textareafield', name: 'description', label: '', placeHolder: '请输入问题描述', required: true},
							{xtype: 'textareafield', name: 'measure', label: '', placeHolder: '请输入抑制措施'}
						]
					}
				]
			},
			{
				title: '非产品质量处理',
				xtype : 'formpanel',
				scrollable: null,
				items : [
					{
						xtype : 'fieldset',
						items:[
							{xtype: 'numberfield', name: 'indication', label: '', placeHolder: '请输入读数', required: true},
							{xtype: 'hiddenfield', name: 'solveMethod', value: 'nq'},
							{xtype: 'hiddenfield', name: 'isNC', value: '0'},
							{xtype: 'textareafield', name: 'description', label: '', placeHolder: '请输入问题描述', required: true},
							{xtype: 'textareafield', name: 'measure', label: '', placeHolder: '请输入抑制措施'}
						]
					}
				]
			},
			{
				title: '不合格品处理',
				xtype : 'formpanel',
				scrollable: null,
				items : [
					{
						xtype : 'fieldset',
						items:[
							{xtype: 'numberfield', name: 'indication', label: '', placeHolder: '请输入读数', required: true},
							{xtype: 'hiddenfield', name: 'solveMethod', value: 'action'},
							{xtype: 'hiddenfield', name: 'isNC', value: '1'},
							{xtype: 'textareafield', name: 'description', label: '', placeHolder: '请输入问题描述', required: true},
							{xtype: 'uxSelectfield', name: 'partNo', label: '', placeHolder: '请输入零件编号', displayField: 'partNo', autoSelect:false, valueField: 'partNo', store: {type: 'part', storeId: 'part'},
								listeners : {
									pickerchange: function(me, record){
										me.parent.down('[name=partName]').setValue(record.get('partName'));
									}
								}
							},
							{xtype: 'uxSelectfield', name: 'partName', label: '', placeHolder: '请输入零件名称', displayField: 'partName', autoSelect:false, valueField: 'partName', store: {type: 'part', storeId: 'part'},
								listeners : {
									pickerchange: function(me, record){
										me.parent.down('[name=partNo]').setValue(record.get('partNo'));
									}
								}
							},
							// {xtype: 'textfield', name: 'partName', label: '', placeHolder: '请输入零件名称'},
							{xtype: 'numberfield', name: 'actualDisqualified', label: '', placeHolder: '请输入不合格数'},
							{xtype: 'uxSelectfield', name: 'station', label: '', placeHolder: '请输入发现工位', displayField: 'station', valueField: 'station',autoSelect:false, store: {type: 'station', storeId: 'station'}},
							{xtype: 'selectfield', name: 'defectType', label: '', placeHolder: '请输入缺陷类型', autoSelect:false,
								options: [
									{text: '原材料缺陷',  value: '原材料缺陷'},
									{text: '产品缺陷', value: '产品缺陷'}
								]
							}
						]
					}
				]
			},
			{
				height: '20%',
				xtype: 'camera',
				docked : 'bottom'
			}
		]
    }
	// ,
	// initialize:function(){
		// this.callParent(arguments);
		
		// if(this.isPainted()){
			// this.onShowIndication();
		// }
		// else{
			// this.on({
				// painted: 'onShowIndication',
				// single: true,
				// scope: this
			// });
		// }
	// },
	// onShowIndication: function(){
		// var xjItemListRecord = this.getXjItemListRecord();
		
		// if(xjItemListRecord.get('isaIndication') != '是'){
			// this.down('numberfield').setHidden(true);
		// }
	// }
});