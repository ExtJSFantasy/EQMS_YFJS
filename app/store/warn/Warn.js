Ext.define('EQMS.store.warn.Warn', {
    extend: 'EQMS.store.Abstract.Store',
	alias: 'store.warn',
	config : {
		storeId: 'warn',
		model: 'EQMS.model.warn.Warn',
		method: 'andon/getWarn',
		// autoLoad : true,
		proxy: {
            type: 'ajax',
			// extraParams: {status: '未完成', createUser: '002'},
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