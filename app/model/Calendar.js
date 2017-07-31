Ext.define('EQMS.model.Calendar', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'EventId',
        fields: [{
            name: 'EventId',
            type: 'int'
        }, {
            name: 'Title',
            type: 'string',
            defaultValue: null
        }, {
            name: 'StartDate',
            type: 'date'
        }, {
            name: 'EndDate',
            type: 'date'
        }, {
            name: 'color',
            type: 'string'
        }]
    }
});