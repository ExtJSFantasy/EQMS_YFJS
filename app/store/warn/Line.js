Ext.define('EQMS.store.warn.Line', {
    extend: 'EQMS.store.Abstract.Store',
	alias: 'store.line',
	config : {
		storeId: 'line',
		model: 'EQMS.model.warn.Line',
		method: 'andon/getLine',
		// autoLoad : true,
		proxy: {
            type: 'ajax',
			// extraParams: {warnId: '1'},
			actionMethods: {
				read: "POST"
			},
            reader: {
                type: "json",
                rootProperty: 'data'
                // totalProperty: 'totalCounts'
            }
        }
	}
});