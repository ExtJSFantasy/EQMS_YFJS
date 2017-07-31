Ext.define('EQMS.controller.xj.List', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			main: 'main',
			xjList: 'xjList',
			xjItemList: 'xjItemList',
			linetabbar: 'xjList [itemId=linetabbar]'
		},
		control: {
			xjList:{
				itemtap: 'onListItemTap',
				activate: "onActivate"
			},
			linetabbar:{
				itemtap: 'onLinetabbarTap'
			}
		}
	},
	onActivate: function(newActiveItem, list, oldActiveItem, eOpts){
		var _sql = ' exec SP_PAD_PP_getLists '; //巡检清单
		util.storeLoad(this.getXjList(), {sql: _sql});
	},
	onListItemTap: function(list, index, target, record, e, eOpts){
		var it = this;
		var main = it.getMain();
		var xjItemList = it.getXjItemList();
		if(!xjItemList) xjItemList = Ext.create('EQMS.view.xj.ItemList');
		xjItemList.setXjListRecord(record);
		
		xjItemList.down('fieldset').setTitle(record.get('listName') +' -- '+ record.get('productionLine'));
		
		var _sql = ' exec SP_PAD_PP_getInspectList @listSubId = '+record.get('listSubId')+' ';
		if(record.get('auditor') != null){
			_sql = "exec SP_PAD_PP_getInspectStoreList @masterSubId="+record.get('subId')+",@workDate='"+Ext.Date.format(record.get('inspectDate'), 'Y-m-d')+"'"
			
			xjItemList.down('#classes').setValue(record.get('shift'));
			var checkTime = Ext.Date.format(record.get('inspectDate'), 'Y/m/d')+' '+record.get('checkTime');
			xjItemList.down('#checkTime').setValue(new Date(checkTime));
		}
		
		util.storeLoad(xjItemList, {sql: _sql});
		main.push(xjItemList);
	},
	onLinetabbarTap: function( dw, index, target, record, e, eOpts ){
		var xjList = this.getXjList();
		var _sql = ' exec SP_PAD_PP_getLists '; //巡检清单
		
		if(record.get('value') == 'ok'){ //已完成
			_sql = "exec SP_PP_getInspectTaskWin @workDate='"+Ext.Date.format(new Date(), 'Y-m-d')+"',@userName='"+$userName+"'";
		}
		util.storeLoad(xjList, {sql: _sql});
	}
});