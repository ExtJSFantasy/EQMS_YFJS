Ext.define('EQMS.store.xj.List', {
    extend: 'EQMS.store.Abstract.Store',
	alias: 'store.xjList',
	config : {
		storeId: 'xjList',
		model: 'EQMS.model.xj.List',
		method: 'xj/query',
		proxy: {
			type: 'ajax',
			// url: Config.host+'query',
			actionMethods: {
				read: "POST"
			},
			reader: {
				type: 'json',
				rootProperty: "data"
			}
		}
	}
});