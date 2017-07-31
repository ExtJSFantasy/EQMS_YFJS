Ext.define('EQMS.store.warn.WarnList', {
    extend: 'EQMS.store.Abstract.Store',
	alias: 'store.warnList',
	config : {
		storeId: 'warnList',
		model: 'EQMS.model.warn.WarnList',
		// autoDestroy: true,
		// autoLoad : true,
		pageSize: 20,
		method: 'andon/getWarnList',
		// remoteSort: true,
        // remoteFilter: true,
		sorters:[
			{
				property : 'active',
				direction: 'desc'
			}
		],
		proxy: {
            type: 'ajax',
			// extraParams: {status: '未完成', createUser: '002'},
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