Ext.define('EQMS.store.Hosts', {
    extend: 'Ext.data.Store',
    alias: "store.hosts",
    requires: [
        "EQMS.model.Host",
        'Ext.data.proxy.LocalStorage'
    ],
    config: {
        autoLoad: true,
        autoSync: true,
		method: null,
        model: 'EQMS.model.Host',
        proxy: {
            type: 'localstorage',
            id: 'EQMS-hosts'
        }
    },
    addHost: function (url) {
        if(!util._demo || util._demo.host != url){
            var idx = this.findBy(function(r) { return r.get('address') == url; });
            if (idx == -1) {
                var r = Ext.create(this.getModel(), { address: url });
                this.add(r);
            }
        }
    }
});