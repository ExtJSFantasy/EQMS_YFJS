Ext.define('EQMS.model.warn.Station', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
			{name: 'id', type: 'string'},
			{name: 'name', type: 'string'},
			{name: 'warnId', type: 'string'},
			{name: 'iconColor', type: 'string'}
		]
    }
});