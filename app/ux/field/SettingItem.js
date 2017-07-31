//设置页 设置项>
Ext.define('UX.field.SettingItem', {
    extend: 'Ext.field.Field',
    alias: 'widget.settingitem',
    requires: ['UX.field.DisplayComponent'],

    isField: false,

    config: {
        component: {
            xtype: 'displaycomponent'
        },
        cls: 'x-field-settingitem',
        ui: 'disclose'
    },
    updateValue: function(value) {
        this.getComponent().displayElement.setHtml(value);
    },
    initialize: function() {
        this.callParent();
        this.element.on({
            scope: this,
            tap: 'onFocus',
            touchstart: 'onTouchStart',
            touchend: 'onTouchEnd',
            touchcancel: 'onTouchEnd',
            touchmove: 'onTouchEnd'
        });
    },
    onFocus: function(e) {
        if (this.getDisabled()) {
            return false;
        }

        this.fireEvent('disclose', this, e);

        this.isFocused = true;
    },
    addPressedClass: function() {
        this.element.addCls('pressing');
    },
    onTouchStart: function(e){
        this.pressedTimeout = Ext.defer(this.addPressedClass, 100, this);
    },
    onTouchEnd: function(e){
        if (this.pressedTimeout) {
            clearTimeout(this.pressedTimeout);
            delete this.pressedTimeout;
        }
        this.element.removeCls('pressing');
    }
});