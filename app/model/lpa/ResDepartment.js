Ext.define('EQMS.model.lpa.ResDepartment', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
			{
				name: 'userNo',
				type: 'int'
			}, 
			{
				name: 'userName',
				type: 'string'
			},
			{
				name: 'userDescription',
				type: 'string'
			}, 
			{
				name: 'departmentName',
				type: 'string'
			},
			{
				name: 'solverName',
				type: 'string'
			}
		]
    }
});