Ext.define('EQMS.model.warn.Warn', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
			{name: 'id', type: 'string'},
			{name: 'name', type: 'string'},
			{name: 'iconColor', type: 'string'}
		]
    }
});