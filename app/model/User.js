Ext.define('EQMS.model.User', {
    extend: 'Ext.data.Model',
    config: {
		idProperty: 'userId',
        fields: [
			{name: 'userId', type: 'int'},
			{name: 'userName', type: 'string'},
			{name: 'userDescription', type: 'string'},
			{name: 'pwd', type: 'string'}
		],
		validations:[
			{type: 'presence', field:'userName',message:'请输入用户名'},
			{type: 'presence', field:'pwd',message:'请输入密码'}
		],
		proxy: {
			type: 'localstorage',
			id: 'login-data'
		}
    }
});