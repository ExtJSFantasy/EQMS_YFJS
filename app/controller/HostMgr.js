Ext.define('EQMS.controller.HostMgr', {
	extend: 'Ext.app.Controller',
	requires: [
	],
	config: {
		refs: {
			loginView: 'login',
			hostMgr: 'hostmgr',
			backBtn: 'hostmgr [itemId=backBtn]',
			addBtn: 'hostmgr [itemId=add]'
		},
		control: {
			hostMgr:{
				activate: 'onActivate',
				deactivate: 'onDeactivate',
				listoptiontap: 'optTap'
			},
			backBtn: {
				tap: 'onBackBtn'
			},
			addBtn:{
				tap: 'onTapAdd'
			}
		}
	},
	onBackBtn: function(btn, e, opt){
		var host = this.getHostMgr().getValue();
        if (Ext.isEmpty(host)) {
            util.JsErrMsg('请设置一个有效的帐套地址.');
        }
        else {
            var hostMgr = this.getHostMgr();
			Ext.Viewport.setActiveItem('login');
			hostMgr.destroy();
        }
	},
	onActivate: function(list){
        list.getStore().load({
            callback: function() {
                list.setValue(util.getHost());
            }
        });
    },
    onDeactivate: function(list){
        var host = util.getHost(),
            nHost = list.getValue(); 
			
        if(host != nHost && !Ext.isEmpty(nHost)){
            util.changeSetting({ host: nHost });
        }
    },
    optTap: function(action, list, record){
        if(action == 'Edit') {
            this.onTapEdit(list, record);
        }
        else if(action == 'Remove') {
            this.onTapDelete(list, record);
        }
    },
    onTapAdd: function(btn) {
		var list = this.getHostMgr();
        Ext.Msg.prompt(
            '输入新地址',
            '如:' + (util.getHost() || (util._demo && util._demo.host)), 
            function(btn, value) {
                if (btn == 'ok') {
                    list.addAddress(value);
                }
            },
            null,
            true,
            null,
            { xtype: 'textareafield' }
        );
    },
    onTapEdit: function(list, record) {
        var host = util.getHost(),
            s = list.getStore();
        Ext.Msg.prompt(
            '编辑地址',
            '如:' + (util.getHost() || (util._demo && util._demo.host)), 
            function(btn, value) {
                if (btn == 'ok') {
                    list.updateAddress(value, record);
                }
            },
            null,
            true,
            record.get('address'),
            { xtype: 'textareafield' }
        );
    },
    onTapDelete: function(list, record) {
        var s = list.getStore();
        s.remove(record);
    }
});