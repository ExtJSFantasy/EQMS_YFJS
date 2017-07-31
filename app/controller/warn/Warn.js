Ext.define('EQMS.controller.warn.Warn', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			main: 'main',
			home: 'home',
			warn: 'warn',
			station: 'station'
		},
		control: {
			warn:{
				itemsingletap: 'onItemsingletap'
			}
		}
	},
	onItemsingletap: function(dataview, index, target, record, e, eOpts ){
		var it = this;
		var station = this.getStation();
		
		if(!station) station = Ext.create('EQMS.view.warn.Station');
		station.setWarnRecord(record);
		var line = this.getWarn().down('#selectfield').getValue();
		console.log('line',line);
		util.storeLoad(station, {warnId: record.get('id'), lineId: line});
		/*store.filter([{
		    property: 'lineId',
		    value: newValue
		}]);*/
		/*var line = util.getLsItem('line');
		util.storeLoad(station, {warnId: record.get('id'), lineId: line});*/
		
		/*var line = util.getLsItem('line');
		if(line && line!=''){
			station.getStore().filter("lineId", line);
		}*/
		this.getMain().push(station);
	}
});