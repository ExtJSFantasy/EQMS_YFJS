Ext.define('UX.picker.DateTime', {
    extend: 'Ext.picker.Date',
    xtype: 'datetimepicker',
    alternateClassName: 'UX.DateTimePicker',

    config: {

        /**
        * @cfg {String} monthText
        * The label to show for the month column.
        * @accessor
        */
        monthText: (Ext.os.deviceType.toLowerCase() == "phone") ? 'M' : 'Month',

        /**
        * @cfg {String} dayText
        * The label to show for the day column.
        * @accessor
        */
        dayText: (Ext.os.deviceType.toLowerCase() == "phone") ? 'j' : 'Day',

        /**
        * @cfg {String} yearText
        * The label to show for the year column.
        * @accessor
        */
        yearText: (Ext.os.deviceType.toLowerCase() == "phone") ? 'Y' : 'Year',

        /**
        * @cfg {String} hourText
        * The label to show for the hour column. Defaults to 'Hour'.
        */
        hourText: (Ext.os.deviceType.toLowerCase() == "phone") ? 'H' : 'Hour',

        /**
        * @cfg {String} minuteText
        * The label to show for the minute column. Defaults to 'Minute'.
        */
        minuteText: (Ext.os.deviceType.toLowerCase() == "phone") ? 'i' : 'Minute',

        /**
        * @cfg {String} ampmText
        * The label to show for the ampm column. Defaults to 'AM/PM'.
        */
        ampmText: (Ext.os.deviceType.toLowerCase() == "phone") ? 'A' : 'AM/PM',

        /**
        * @cfg {Array} slotOrder
        * An array of strings that specifies the order of the slots.
        * @accessor
        */
        //slotOrder: ['month', 'day', 'year', 'hour', 'minute', 'ampm'],
        slotOrder: ['month', 'day', 'year', 'hour', 'minute'],

        /**
        * @cfg {Int} minuteInterval
        * @accessor
        */
        minuteInterval: 15,

        /**
        * @cfg {Boolean} ampm
        * @accessor
        */
        ampm: false
    },

    setValue: function(value, animated) {
        if (Ext.isDate(value)) {

            ampm = 'AM';
            currentHours = hour = value.getHours();
            if (this.getAmpm()) {
                if (currentHours > 12) {
                    ampm = "PM";
                    hour -= 12;
                } else if (currentHours == 12) {
                    ampm = "PM";
                } else if (currentHours == 0) {
                    hour = 12;
                }
            }
            value = {
                day: value.getDate(),
                month: value.getMonth() + 1,
                year: value.getFullYear(),
                hour: hour,
                minute: value.getMinutes(),
                ampm: ampm
            };
        }

        UX.picker.DateTime.superclass.superclass.setValue.call(this, value, animated);
        this.onSlotPick();
    },

    getValue: function(useDom) {
        var values = {},
            daysInMonth, day, hour, minute,
            items = this.getItems().items,
            ln = items.length,
            item, i;

        for (i = 0; i < ln; i++) {
            item = items[i];
            if (item instanceof Ext.picker.Slot) {
                values[item.getName()] = item.getValue(useDom);
            }
        }
        daysInMonth = this.getDaysInMonth(values.month, values.year);
        day = Math.min(values.day, daysInMonth), hour = values.hour, minute = values.minute;


        var yearval = (isNaN(values.year)) ? new Date().getFullYear() : values.year,
            monthval = (isNaN(values.month)) ? (new Date().getMonth()) : (values.month - 1),
            dayval = (isNaN(day)) ? (new Date().getDate()) : day,
            hourval = (isNaN(hour)) ? new Date().getHours() : hour,
            minuteval = (isNaN(minute)) ? new Date().getMinutes() : minute;
        if (values.ampm && values.ampm == "PM" && hourval < 12) {
            hourval = hourval + 12;
        }
        if (values.ampm && values.ampm == "AM" && hourval == 12) {
            hourval = 0;
        }
        return new Date(yearval, monthval, dayval, hourval, minuteval);
    },

    /**
    * Generates all slots for all years specified by this component, and then sets them on the component
    * @private
    */
    createSlots: function() {
        var me = this,
            slotOrder = this.getSlotOrder(),
            yearsFrom = me.getYearFrom(),
            yearsTo = me.getYearTo(),
            years = [],
            days = [],
            months = [],
            hours = [],
            minutes = [],
            ampm = [],
            ln, tmp, i,
            daysInMonth;

        if (!this.getAmpm()) {
            var index = slotOrder.indexOf('ampm')
            if (index >= 0) {
                slotOrder.splice(index);
            }
        }
        // swap values if user mixes them up.
        if (yearsFrom > yearsTo) {
            tmp = yearsFrom;
            yearsFrom = yearsTo;
            yearsTo = tmp;
        }

        for (i = yearsFrom; i <= yearsTo; i++) {
            years.push({
                text: i,
                value: i
            });
        }

        daysInMonth = this.getDaysInMonth(1, new Date().getFullYear());

        for (i = 0; i < daysInMonth; i++) {
            days.push({
                text: i + 1,
                value: i + 1
            });
        }

        for (i = 0, ln = Ext.Date.monthNames.length; i < ln; i++) {
            months.push({
                text: (Ext.os.deviceType.toLowerCase() == "phone") ? Ext.Date.monthNames[i].substring(0, 3) : Ext.Date.monthNames[i],
                value: i + 1
            });
        }

        var hourLimit = (this.getAmpm()) ? 12 : 23
        var hourStart = (this.getAmpm()) ? 1 : 0
        for (i = hourStart; i <= hourLimit; i++) {
            hours.push({
                text: this.pad2(i),
                value: i
            });
        }


        for (i = 0; i < 60; i += this.getMinuteInterval()) {
            minutes.push({
                text: this.pad2(i),
                value: i
            });
        }

        ampm.push({
            text: 'AM',
            value: 'AM'
        }, {
            text: 'PM',
            value: 'PM'
        });

        var slots = [];

        slotOrder.forEach(function(item) {
            slots.push(this.createSlot(item, days, months, years, hours, minutes, ampm));
        }, this);

        me.setSlots(slots);
    },

    /**
    * Returns a slot config for a specified date.
    * @private
    */
    createSlot: function(name, days, months, years, hours, minutes, ampm) {
        var type = Ext.os.deviceType.toLowerCase();
        switch (name) {
            case 'year':
                return {
                    name: 'year',
                    align: (type == "phone") ? 'left' : 'center',
                    data: years,
                    title: this.getYearText(),
                    flex: (type == "phone") ? 1.3 : 3
                };
            case 'month':
                return {
                    name: name,
                    align: (type == "phone") ? 'left' : 'right',
                    data: months,
                    title: this.getMonthText(),
                    flex: (type == "phone") ? 1.2 : 4
                };
            case 'day':
                return {
                    name: 'day',
                    align: (type == "phone") ? 'left' : 'center',
                    data: days,
                    title: this.getDayText(),
                    flex: (type == "phone") ? 0.9 : 2
                };
            case 'hour':
                return {
                    name: 'hour',
                    align: (type == "phone") ? 'left' : 'center',
                    data: hours,
                    title: this.getHourText(),
                    flex: (type == "phone") ? 0.9 : 2
                };
            case 'minute':
                return {
                    name: 'minute',
                    align: (type == "phone") ? 'left' : 'center',
                    data: minutes,
                    title: this.getMinuteText(),
                    flex: (type == "phone") ? 0.9 : 2
                };
            case 'ampm':
                return {
                    name: 'ampm',
                    align: (type == "phone") ? 'left' : 'center',
                    data: ampm,
                    title: this.getAmpmText(),
                    flex: (type == "phone") ? 1.1 : 2
                };
        }
    },


    getSlotByName: function(name) {
        return this.down('pickerslot[name=' + name + ']');
    },

    getDaySlot: function() {
        return this.getSlotByName('day');
    },
    pad2: function(number) {
        return (number < 10 ? '0' : '') + number
    }
});