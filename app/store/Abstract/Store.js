Ext.define("EQMS.store.Abstract.Store", {
    extend: "Ext.data.Store",
    config: {
        autoDestroy: true,
        //由于可以动态设置url，所以不在define的时候配置，
        //而只是给store配置一个自定义属性invokeTarget，
        //在initialize的时候应用invokeTarget，url改变的时候也应用下invokeTarget
        method: null,
		model: null,
        silence: false
    },
    constructor: function() {
        this.callParent(arguments);

        var proxy = this.getProxy();
        // proxy.setUseDefaultXhrHeader(false); //跨域
        // proxy.setWithCredentials(true); //跨域时带上cookies
        
        proxy.on('exception', function(proxy, resp, options) {
            var msg = resp.responseText || resp.statusText;
            if(resp.status == '0'){
                // Pnt.ToastShort(msg); //communication failure
				Ext.toast(msg);
            }
            else if (resp.status == '-1') {
                //aborted
            }
            else if(resp.status == '440'){
               Ext.toast(msg);
                // RouteUtil.needLogin();
            }
            else if(!this.getSilence()){
                Ext.toast(msg);
            }
            //<debug>
            // console.log(proxy, resp, options);
            //</debug>
        }, this);
        this.on({
            beforeload: 'beforeStoreLoad',
            scope: this
        });
    },
    updateMethod: function(t, oldT){
        var proxy = this.getProxy(),
            invokeUrl = util.getHost() + t ;
        // console.log("invokeUrl-->: ", invokeUrl);
		proxy.setUrl(invokeUrl);
    },
    beforeStoreLoad: function(){
        // var proxy = this.getProxy(),
            // info = Pnt.getClientInfo();
        // for(var i in info){
            // proxy.setExtraParam(i, info[i]);
        // }
    }
});