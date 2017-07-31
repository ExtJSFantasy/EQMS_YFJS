Ext.define('EQMS.model.warn.WarnList', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
			{name: 'id', type: 'string'},
			{name: 'active', type: 'int'},
			{name: 'lineId', type: 'int'},
			{name: 'lineName', type: 'string'},
			{name: 'createDate', type: 'date'},
			{name: 'createUser', type: 'string'},
			{name: 'status', type: 'string'},
			{name: 'warnType', type: 'string'},
			{name: 'warnTypeName', type: 'string'},
			{name: 'station', type: 'string'},
			{name: 'status2', type: 'string'},
			{name: 'date2', type: 'date'},
			{name: 'date2Length', type: 'string'},
			{name: 'status3', type: 'string'},
			{name: 'date3', type: 'date'},
			{name: 'date3Length', type: 'string'},
			{name: 'totalHours', type: 'string'},
			{name: 'code', type: 'string'},
			{name: 'problemType', type: 'string'},
			{name: 'solution', type: 'string'},
			{name: 'equipment', type: 'string'},
			{name: 'otherSolution', type: 'string'}
		]
    }
});