Ext.define('EQMS.store.lpa.ItemList', {
    extend: 'EQMS.store.Abstract.Store',
	alias: 'store.itemList',
	config : {
		storeId: 'itemList',
		model: 'EQMS.model.lpa.ItemList',
		method: 'lpa/getPerItemDetail',
		sorters:[
			{
				property: "id",//ÅÅÐò×Ö¶Î
				direction: "ASC"
			}
		],
		groupField: 'childGroupBy',
		// remoteSort: true, //Ä¬ÈÏÒÑ¾­ÅÅÐò
		// autoDestroy: true,
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
	},
	initialize: function () {
		var it = this;
		this.callParent(arguments);
	}
});