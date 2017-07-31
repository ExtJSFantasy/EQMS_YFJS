//设置页设置帐套
Ext.define('EQMS.view.HostMgr', {
    extend: "Ext.List",
    xtype: 'hostmgr',
    requires: [
        "EQMS.store.Hosts",
		'Ext.form.FieldSet',
		'UX.plugin.ListOptions',
		'Ext.field.Toggle'
    ],
    config: {
        itemTpl: [
            '<div class="flexbox">',
				'<div class="select"></div>',
				'<div class="flex10">{address}</div>',
			'</div>'
        ].join(''),
        mode: "SINGLE",
        
        cls: "hostMgr",
		items: [{
            xtype: 'titlebar',
			docked: 'top',
            title: '账套设置',
            items: [
			{
                iconCls: 'back',
                itemId: 'backBtn',
                align: 'left',
				text: '返回'
            },
			{
                xtype: 'spacer'
            },{
                iconCls: 'add',
                itemId: 'add',
                align: 'right'
            }]
        }, {
			xtype: 'fieldset',
			scrollDock: 'top',
            margin: 0,
			items: [{
				xtype: 'togglefield',
				labelCls: 'label-black',
				labelWidth: '81%',
				name: 'enableDemo',
				label: '启用演示帐套',
				listeners: {
					change: function(field, value){
						var list = field.up('hostmgr');
						if(value == 1)
							list.addCls('hide-listitem');
						else 
							list.removeCls('hide-listitem');
					}
				}
			}]
		}],
		listeners: {
			listoptiontap: 'optTap',
			tapadd: 'onTapAdd'
		}
    },
    initialize: function() {
		var me = this;
        me.callParent(arguments);

        var store = Ext.getStore("Hosts") || Ext.StoreMgr.lookup({ 
            type: 'hosts', 
            storeId: "Hosts" 
        });
        me.setStore(store);
        
        util.addPlugins(me, { 
            type:"listopt",
            items: [{
                action:"Edit",
                color: 'blue',
                text: '编辑'
            }, {
                action:"Remove",
                color: 'red',
                text: '删除'
            }]
        });

		me.down('togglefield').setHidden(!util._demo);
        //Pnt.decideScrollable(me);
    },
    getValue: function() {
		var togglefield = this.down('togglefield');
		if(util._demo && togglefield.getValues() == 1)
			return util._demo.host;
		
        var r = this.getSelection()[0];
        return r ? r.get('address') : '';
    },
    setValue: function(v) {
		var togglefield = this.down('togglefield');
		console.log(util._demo);
		if(util._demo && util._demo.host == v) {
			togglefield.setValues(1);
			return;
		}
        else {
            togglefield.setValues(0);
        }
	
        var store = this.getStore(),
            idx = store.findBy(function(r) { return r.get('address') == v; }),
            r;
        if (idx >= 0) {
            r = store.getAt(idx);
        }
        else {
            r = this.addAddress(v);
        }
        this.select(r);
    },
    addAddress: function(value) {
		console.log("addAddress");
		console.log(value);
        value = util.formatHost(value);
        var store = this.getStore(),
            idx = store.findBy(function(r) { return r.get('address') == value; }),
			isdemo = !!util._demo && util._demo.host == value;
			
		if(idx > -1) {
			util.ToastShort('相同的帐套已存在.');
		}
        else if (!isdemo) {
            var r = Ext.create(store.getModel(), { address: value });
            store.add(r);
            return r;
        }
    },
    updateAddress: function(value, record) {
        value = util.formatHost(value);
		var store = this.getStore(),
            idx = store.findBy(function(r) { return r.get('address') == value; }),
			isdemo = !!util._demo && util._demo.host == value;
		if(idx > -1) {
			util.ToastShort('相同的帐套已存在.');
		}
		else if (!isdemo) {            
			record.set('address', value);
			return record;
        }
    },
    onBack: function(){
        var host = this.getValue();
        if (Ext.isEmpty(host)) {
            util.JsErrMsg('请设置一个有效的帐套地址.');
        }
        else {
            history.back();
        }
    }
});