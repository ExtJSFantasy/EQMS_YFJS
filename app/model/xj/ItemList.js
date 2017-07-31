Ext.define('EQMS.model.xj.ItemList', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
			{name: 'subId', type: 'int'},
			{name: 'itemId', type: 'int'},
			'stationName', // 工位名称
			{name: 'id', type: 'int'}, //检查项Id
			'checkList', //	检查项
			'checkNo',
			'isaIndication',	//是否读数(隐藏标记)
			'indication', //	读数
			'auditResult', // 审核结果
			'solveMethod', //	解决方法
			'description', //	描述
			'measure', //	措施
			'isolation', //	
			'actualDisqualified', //
			'partNo', //
			'partName', //
			'defectType', //
			'station', //
			'lgort'
		]
    }
});