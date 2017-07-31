Ext.define('EQMS.store.warn.Solution', {
    extend: 'EQMS.store.Abstract.Store',
	alias: 'store.solution',
	config : {
		storeId: 'solution',
		model: 'EQMS.model.warn.Solution',
		method: 'andon/getSolution',
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