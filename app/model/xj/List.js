Ext.define('EQMS.model.xj.List', {
    extend: 'Ext.data.Model',
	/*
		//listSubId 隐藏
		listName 清单名称
		productionLine 生产线
		//auditor 隐藏
		auditorName	检查人员
		inspectDate	检查日期 yy-MM-dd
		checkTime	检查时间 mm:ss
		shift	班次
		totalNum 检查项数
		nokNum	不符数
	*/
    config: {
        fields: [
			{name: 'subId', type: 'int'},
			{name: 'listSubId', type: 'int'},
			'listName',
			'productionLine',
			'auditor',
			'auditorName',
			{name: 'inspectDate', type: 'date'},
			'checkTime',
			'shift',
			{name: 'totalNum', type: 'int'},
			{name: 'nokNum', type: 'int'}
		]
    }
});