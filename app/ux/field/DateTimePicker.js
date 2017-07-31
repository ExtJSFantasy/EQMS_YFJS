Ext.define('UX.field.DateTimePicker', {
    extend: 'Ext.field.DatePicker',
    xtype: 'datetimepickerfield',
    requires: [
        'UX.picker.DateTime'
    ],

    /**
     * @event change
     * Fires when a date is selected
     * @param {Ext.ux.field.DateTimePicker} this
     * @param {Date} date The new date
     */

    config: {

        /**
         * @cfg {String} dateFormat The format to be used when displaying the date in this field.
         * Accepts any valid datetime format. You can view formats over in the {@link Ext.Date} documentation.
         * Defaults to `Ext.util.Format.defaultDateFormat`.
         */
        dateFormat: 'm/d/Y H:i'
    },

    applyValue: function(value) {
        if (!Ext.isDate(value) && !Ext.isObject(value)) {
            value = null;
        }

        if (Ext.isObject(value)) {
            value = new Date(value.year, value.month - 1, value.day,value.hour,value.minute);
        }

        return value;
    },

    /**
     * Returns the {@link Date} value of this field.
     * If you wanted a formated date
     * @return {Date} The date selected
     */
    getValue: function() {
        if (this._picker && this._picker instanceof UX.picker.DateTime) {
            return this._picker.getValue();
        }

        return this._value;
    },

    getPicker: function() {
        var picker = this._picker,
            value = this.getValue();

        if (picker && !picker.isPicker) {
            picker = Ext.factory(picker, UX.picker.DateTime);
            
            if (value !== null) {
                picker.setValue(value);
            }
        }
        picker.on({
            scope: this,
            change: 'onPickerChange',
            hide  : 'onPickerHide'
        });
        
        this._picker = picker;

        return picker;
    }
    //<deprecated product=touch since=2.0>
}, function() {
    this.override({
        getValue: function(format) {
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
     * @inheritdoc Ext.ux.field.DateTimePicker#getPicker
     * @deprecated 2.0.0 Please use #getPicker instead
     */
    Ext.deprecateMethod(this, 'getDatePicker', 'getPicker');
    //</deprecated>
});
