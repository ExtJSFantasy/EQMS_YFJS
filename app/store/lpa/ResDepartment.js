Ext.define('EQMS.store.lpa.ResDepartment', {
    extend: 'EQMS.store.Abstract.Store',
	alias: 'store.resDepartment',
	config : {
		storeId: 'resDepartment',
		model: 'EQMS.model.lpa.ResDepartment',
		method: 'lpa/getAllUser',
		proxy: {
            type: 'ajax',
            //extraParams: {searchVal: null},
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