Ext.define('EQMS.store.xj.ItemList', {
    extend: 'EQMS.store.Abstract.Store',
	alias: 'store.xjItemList',
	config : {
		storeId: 'xjItemList',
		model: 'EQMS.model.xj.ItemList',
		method: 'xj/query',
		sorters:[
			{
				property: "id",//排序字段
				direction: "ASC"
			}
		],
		grouper:{
			sortProperty: 'id',//排序字段
			direction: 'ASC',
			groupFn:function(record){
				return record.get('stationName')
			}
		},
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