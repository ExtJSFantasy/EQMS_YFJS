Ext.define('EQMS.model.warn.ListDetail', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
			{name: 'problemType', type: 'string'},
			{name: 'solution', type: 'string'},
			{name: 'equipment', type: 'string'},
			{name: 'otherSolution', type: 'string'}
		],
		validations:[
			// {type: 'presence', field:'problemType',message:'请选择问题'},
			//{type: 'presence', field:'solution',message:'请选择解决方案'},
			{type: 'presence', field:'otherSolution',message:'请输入额外处理信息'}
			// {type: 'presence', field:'equipment',message:'请选择设备'}
		]
		// ,
		// proxy: {
			// type: 'localstorage',
			// id: 'login-data'
		// }
    }
});