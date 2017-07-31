Ext.define('UX.field.DisplayComponent', {
    extend: 'Ext.Component',
    xtype: 'displaycomponent',
    config: {
        cls: 'x-field-input displayCmp'
    },
    getTemplate: function() {
        return [
            {
                reference: 'displayElement',
                tag: 'div',
                cls: 'displayEl'
            }
        ];
    }
});