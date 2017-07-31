Ext.define('EQMS.model.xj.ItemDetail', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
			'solveMethod',
			'isNC',
			'description',
			'measure',
			'partNo',
			'partName',
			'actualDisqualified',
			'station',
			'defectType'
		],
		validations:[
			{type: 'presence', field:'description',message:'问题描述不能为空'}
		]
    }
});