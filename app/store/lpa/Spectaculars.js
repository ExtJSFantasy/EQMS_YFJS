Ext.define('EQMS.store.lpa.Spectaculars', {
    extend: 'EQMS.store.Abstract.Store',
	alias: 'store.spectaculars',
	config : {
		storeId: 'spectaculars',
		model: 'EQMS.model.lpa.Spectaculars',
		// autoLoad : true,
		method: 'lpa/getSpectaculars',
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
                rootProperty: 'data'
            }
        }
	}
});