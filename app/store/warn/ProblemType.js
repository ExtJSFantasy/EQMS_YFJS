Ext.define('EQMS.store.warn.ProblemType', {
    extend: 'EQMS.store.Abstract.Store',
	alias: 'store.problemType',
	config : {
		storeId: 'problemType',
		model: 'EQMS.model.warn.ProblemType',
		method: 'andon/getProblemType',
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