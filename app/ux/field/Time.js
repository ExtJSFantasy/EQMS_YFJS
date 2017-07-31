Ext.define('UX.field.Time', {
    extend: 'Ext.field.Text',
    alternateClassName: 'uxFieldTime',
    xtype: 'uxFieldTime',
    requires: [
        'UX.picker.Time',
        'Ext.DateExtras'
    ],

    /**
    * @event change
    * Fires when a date is selected
    * @param {Ext.field.DatePicker} this
    * @param {Date} newDate The new date
    * @param {Date} oldDate The old date
    */

    config: {
        ui: 'select',

        /**
        * @cfg {Object/ux.picker.Time} picker
        * An object that is used when creating the internal {@link ux.picker.Time} component or a direct instance of {@link ux.picker.Time}.
        * @accessor
        */
        picker: true,

        /**
        * @cfg {Boolean}
        * @hide
        * @accessor
        */
        clearIcon: false,

        /**
        * @cfg {Object/Date} value
        * Default value for the field and the internal {@link ux.picker.Time} component. Accepts an object of 'year',
        * 'month' and 'day' values, all of which should be numbers, or a {@link Date}.
        *
        * Example: {year: 1989, day: 1, month: 5} = 1st May 1989 or new Date()
        * @accessor
        */


        /**
        * @cfg {Boolean} destroyPickerOnHide
        * 完成选择时隐藏或者销毁该控件，默认销毁
        * @accessor
        */
        destroyPickerOnHide: false,

        /**
        * @cfg {String} dateFormat 默认时间格式
        * 接受任何有效的时间格式. 请参考 {@link Ext.Date}.
        */
        dateFormat: 'Y-m-d H:i',

        /**
        * @cfg {Object}
        * @hide
        */
        component: {
            useMask: true
        }
    },

    initialize: function () {
        var me = this,
            component = me.getComponent();

        me.callParent();

        component.on({
            scope: me,
            masktap: 'onMaskTap'
        });


        component.doMaskTap = Ext.emptyFn;

        if (Ext.browser.is.AndroidStock2) {
            component.input.dom.disabled = true;
        }
    },

    syncEmptyCls: Ext.emptyFn,

    applyValue: function (value) {
        if (!Ext.isDate(value) && !Ext.isObject(value)) {
            return null;
        }

        if (Ext.isObject(value)) {
            return new Date(value.year, value.month - 1, value.day, value.hour, value.minute);
        }

        return value;
    },

    updateValue: function (newValue, oldValue) {
        var me = this,
            picker = me._picker;

        if (picker && picker.isPicker) {
            picker.setValue(newValue);
        }

        // Ext.Date.format expects a Date
        if (newValue !== null) {
            me.getComponent().setValue(Ext.Date.format(newValue, me.getDateFormat() || Ext.util.Format.defaultDateFormat));
        } else {
            me.getComponent().setValue('');
        }

        if (newValue !== oldValue) {
            me.fireEvent('change', me, newValue, oldValue);
        }
    },

    /**
    * Updates the date format in the field.
    * @private
    */
    updateDateFormat: function (newDateFormat, oldDateFormat) {
        var value = this.getValue();
        if (newDateFormat != oldDateFormat && Ext.isDate(value)) {
            this.getComponent().setValue(Ext.Date.format(value, newDateFormat || Ext.util.Format.defaultDateFormat));
        }
    },

    /**
    * Returns the {@link Date} value of this field.
    * If you wanted a formated date
    * @return {Date} The date selected
    */
    getValue: function () {
        if (this._picker && this._picker instanceof UX.picker.Time) {
            return this._picker.getValue();
        }
        return this._value;
    },

    /**
    * Returns the value of the field formatted using the specified format. If it is not specified, it will default to
    * {@link #dateFormat} and then {@link Ext.util.Format#defaultDateFormat}.
    * @param {String} format The format to be returned.
    * @return {String} The formatted date.
    */
    getFormattedValue: function (format) {
        var value = this.getValue();
        return (Ext.isDate(value)) ? Ext.Date.format(value, format || this.getDateFormat() || Ext.util.Format.defaultDateFormat) : value;
    },

    applyPicker: function (picker, pickerInstance) {
        if (pickerInstance && pickerInstance.isPicker) {
            picker = pickerInstance.setConfig(picker);
        }

        return picker;
    },

    getPicker: function () {
        var picker = this._picker,
            value = this.getValue();

        if (picker && !picker.isPicker) {
            picker = Ext.factory(picker, UX.picker.Time);
            if (value != null) {
                picker.setValue(value);
            }
        }

        picker.on({
            scope: this,
            change: 'onPickerChange',
            hide: 'onPickerHide'
        });

        this._picker = picker;

        return picker;
    },

    /**
    * @private
    * Listener to the tap event of the mask element. Shows the internal DatePicker component when the button has been tapped.
    */
    onMaskTap: function () {
        if (this.getDisabled()) {
            return false;
        }

        this.onFocus();

        return false;
    },

    /**
    * Called when the picker changes its value.
    * @param {ux.picker.Time} picker The date picker.
    * @param {Object} value The new value from the date picker.
    * @private
    */
    onPickerChange: function (picker, value) {
        var me = this,
            oldValue = me.getValue();

        me.setValue(value);
        me.fireEvent('select', me, value);
        me.onChange(me, value, oldValue);
    },

    /**
    * Override this or change event will be fired twice. change event is fired in updateValue
    * for this field. TOUCH-2861
    */
    onChange: Ext.emptyFn,

    /**
    * Destroys the picker when it is hidden, if
    * {@link Ext.field.DatePicker#destroyPickerOnHide destroyPickerOnHide} is set to `true`.
    * @private
    */
    onPickerHide: function () {
        var me = this,
            picker = me.getPicker();

        if (me.getDestroyPickerOnHide() && picker) {
            picker.destroy();
            me._picker = me.getInitialConfig().picker || true;
        }
    },

    reset: function () {
        this.setValue(this.originalValue);
    },

    onFocus: function (e) {
        var component = this.getComponent();
        this.fireEvent('focus', this, e);

        if (Ext.os.is.Android4) {
            component.input.dom.focus();
        }
        component.input.dom.blur();

        if (this.getReadOnly()) {
            return false;
        }

        this.isFocused = true;

        this.getPicker().show();
    },

    // @private
    destroy: function () {
        var picker = this._picker;

        if (picker && picker.isPicker) {
            picker.destroy();
        }

        this.callParent(arguments);
    }
    //<deprecated product=touch since=2.0>
}, function () {
    this.override({
        getValue: function (format) {
            if (format) {
                //<debug warn>
                Ext.Logger.deprecate("format argument of the getValue method is deprecated, please use getFormattedValue instead", this);
                //</debug>
                return this.getFormattedValue(format);
            }
            return this.callOverridden();
        }
    });

    /**
    * @method getDatePicker
    * @inheritdoc Ext.field.DatePicker#getPicker
    * @deprecated 2.0.0 Please use #getPicker instead
    */
    Ext.deprecateMethod(this, 'getDatePicker', 'getPicker');
    //</deprecated>
});