Ext.define('EQMS.model.warn.Line', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
			{name: 'lineId', type: 'number'},
			{name: 'lineName', type: 'string'}
		],
		proxy: {
            type: 'localstorage',
            id: 'EQMS-line'
        }
    }
});