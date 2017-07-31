Ext.define('EQMS.view.Href', {
    alternateClassName: 'panelHref',
    extend: 'Ext.Container',
    xtype: 'panelHref',
    requires: ['UX.ConHref'],
    config: {
    cls:'info',
        title: '内容包含超链接',
        plugins: 'conHref',
        scrollable:null,
        html: '<a href="http:101.227.67.70:9999/andeng/andeng.jsp"></a>'
    }
});