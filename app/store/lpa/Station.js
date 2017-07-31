Ext.define('EQMS.store.lpa.Station', {
    extend: 'EQMS.store.Abstract.Store',
	alias: 'store.station',
	config : {
		storeId: 'station',
		model: 'EQMS.model.lpa.Station',
		pageSize: 15,
		method: 'lpa/getStation',
		// autoLoad : true,
		proxy: {
            type: 'ajax',
            // url: Config.host+'getStation',
			// extraParams: {searchVal: null},
			actionMethods: {
				read: "POST"
			},
            reader: {
                type: "json",
                rootProperty: 'data',
                totalProperty: 'totalCounts'
            }
        }
	},
	initialize: function () {
		var it = this;
		this.callParent(arguments);
		
		// var _sql = "select name as station from T_SYS_baseInfoDetail where active = 1 and level = 2 and typeName = '发现工位' ";
		// console.log(_sql);
		// var _params = {
			// sql : _sql
		// };
		// var url = 'query';
		
		// util.Functions.myAjax(url, _params, function(response, request){
			// var _data = Ext.decode(response.responseText);
			// console.log(_data);
			// it.setData(_data);
		// });
	}
});