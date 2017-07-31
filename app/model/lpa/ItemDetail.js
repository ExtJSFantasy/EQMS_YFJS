Ext.define('EQMS.model.lpa.ItemDetail', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
			'solveMethod',
			'isNC',
			'isborder',
			'describe',
			'partNo',
			'partName',
			'actualDisqualified',
			'station',
			'defectType',
			'solverName',
			'solver',
			'field02',
			'field03',
			'departmentName'
		],
		validations:[
			{type: 'presence', field:'describe',message:'问题描述不能为空'},
			{type: 'presence', field:'solverName',message:'请选择责任人'}
		]
    }
});