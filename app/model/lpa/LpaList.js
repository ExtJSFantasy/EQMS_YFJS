Ext.define('EQMS.model.lpa.LpaList', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
			'id',
			'month',
			'listId',
			'listName',
			'stepId',
			'stepName',
			'groupId',
			'groupName',
			"field01",
			{name:"stepNum",type:'int'},
			{name:'workDate', type:'date'},
			{name:'createDate', type:'date'},
			'createUser',
			'englishName',
			'checkNum',
			'okNum',
			'nokNum',
			'commissionAgent',
			'commissionAgentName',
			'analytics',
			'analyticsSubId',
			'bomInfo17SubId',
			'bomInfo17SubName',
			'bomInfo20SubId',
			'bomInfo20SubName',
			'bomInfo17No',
			'bomInfo20No'
		]
    }
});