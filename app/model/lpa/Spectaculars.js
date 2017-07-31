Ext.define('EQMS.model.lpa.Spectaculars', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
			{
				name: 'name',
				type: 'string'
			}, 
			{
				name: 'isAudit',
				type: 'int'
			}
		]
    }
});