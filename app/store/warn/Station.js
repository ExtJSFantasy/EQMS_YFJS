Ext.define('EQMS.store.warn.Station', {
    extend: 'EQMS.store.Abstract.Store',
	alias: 'store.warnStation',
	config : {
		storeId: 'warnStation',
		model: 'EQMS.model.warn.Station',
		method: 'andon/getStation',
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