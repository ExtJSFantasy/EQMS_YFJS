Ext.define('EQMS.store.warn.Equipment', {
    extend: 'EQMS.store.Abstract.Store',
	alias: 'store.equipment',
	config : {
		storeId: 'equipment',
		model: 'EQMS.model.warn.Equipment',
		method: 'andon/getEquipment',
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