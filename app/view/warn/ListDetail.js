Ext.define('EQMS.view.warn.ListDetail',{
	extend: 'Ext.form.Panel',
	xtype: 'listDetail',
	requires: [
		'Ext.field.Select'
	],
	config:{
		warnRecord: null,
		cls: 'listDetail',
		title: '处理单',
		scrollable: {
			direction: 'vertical',
			directionLock: true
		},
		orient: 'portrait',
		canSwipeback: false, //不可以滑动返回
		navBtns: [
			{
				text: '撤销接警',
				ui: 'red',
				action: 'cancel'
			}
		],
		layout:{
			type: 'vbox',
			align: 'center',
			park: 'center'
		},
		items: [
			{
				xtype: 'fieldset',
				title: '选择问题',
				width: '90%',
				hidden: true,
				items: [
					{xtype: 'selectfield', name: 'problemType', label: '', placeHolder: '选择问题', autoSelect:false, displayField: 'name', valueField: 'id', 
						store: {type: 'problemType', storeId: 'problemType'}
					}
				]
			},
			{
				xtype: 'fieldset',
				title: '选择解决方案',
				width: '90%',
				hidden: true,
				items: [
					{xtype: 'selectfield', name: 'solution', label: '', placeHolder: '选择解决方案', autoSelect:false, displayField: 'name', valueField: 'id', 
						store: {type: 'solution', storeId: 'solution'}
					}
				]
			},
			{
				xtype: 'fieldset',
				title: '选择设备',
				hidden: true,
				width: '90%',
				items: [
					{xtype: 'selectfield', name: 'equipment', label: '', placeHolder: '选择设备', autoSelect:false, displayField: 'name', valueField: 'id', 
						store: {type: 'equipment', storeId: 'equipment'}
					}
				]
			},
			{
				xtype: 'fieldset',
				title: '请填写处理信息',
				width: '90%',
				items: [
					{xtype: 'textareafield', required:true,name: 'otherSolution', label: '', placeHolder: '请填写额外处理信息'}
				]
			},
			{
				xtype: 'button',
				text: '保 存',
				action: 'save',
				itemId: 'save',
				width: '90%',
				margin: '2em 0 0 0',
				ui: 'green'
			},
			{
				xtype: 'button',
				text: '消 警',
				height:'3.3em',
				docked: 'bottom',
				action: 'deal',
				itemId: 'deal',
				ui: 'red'
			}
		]
	}
});