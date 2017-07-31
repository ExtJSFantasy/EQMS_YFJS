Ext.define('EQMS.model.lpa.Part', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
			{
				name: 'partNo',
				type: 'string'
			}, 
			{
				name: 'partName',
				type: 'string'
			}
		]
    }
});