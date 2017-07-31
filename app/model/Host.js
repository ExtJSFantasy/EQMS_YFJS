Ext.define('EQMS.model.Host', {
    extend: 'Ext.data.Model',
    requires: [
    	'Ext.data.identifier.Uuid'
    ],
	config: {
		identifier: 'uuid', //'sequential'
		fields: [
			{ name: 'id', type: 'string' },
			{ name: 'address', type: 'string' }
		]
	}
});