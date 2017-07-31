/*
*监听a标签，用外部浏览器打开链接
*/
Ext.define('UX.ConHref', {
    alias: 'plugin.conHref',
    xtype: 'conHref',
    config: {
        cmp: null,
        //竖向滚动，不显示滚动条
        scrollable: {
            direction: 'vertical',
            directionLock: true,
            indicators: false
        }
    },
    constructor: function (config) {
        this.initConfig(config);
        this.callParent([config]);
    },
    //初始化
    init: function (cmp) {
        this.setCmp(cmp);
    },
    //更新配置
    updateCmp: function (newCmp, oldCmp) {
        if (newCmp) {
            newCmp.element.on({
                tap: 'onTap',
                delegate: 'a',
                scope: this
            });
            newCmp.setScrollable(this.getScrollable());
        }
    },
    //用外部浏览器打开链接
    onTap: function (e, b) {
        var a = e.getTarget('a');
        if (a) {
            a.onclick = function () {
                return false;
            }
            window.open(a.href, '_system');
        }
    }
});