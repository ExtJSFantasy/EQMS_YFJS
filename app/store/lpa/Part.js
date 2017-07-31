Ext.define('EQMS.store.lpa.Part', {
    extend: 'EQMS.store.Abstract.Store',
	alias: 'store.part',
	config : {
		storeId: 'part',
		model: 'EQMS.model.lpa.Part',
		// autoLoad : true,
		method: 'lpa/getPart',
		pageSize: 15,
		proxy: {
            type: 'ajax',
            // url: Config.host+'getPart',
			// extraParams: {searchVal: null},
			actionMethods: {
				read: "POST"
			},
            reader: {
                type: "json",
                rootProperty: 'data',
                totalProperty: 'totalCounts'
            }
        }
	}
});