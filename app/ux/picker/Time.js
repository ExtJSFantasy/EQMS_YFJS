Ext.define('UX.picker.Time', {
    extend: 'Ext.picker.Picker',
    xtype: 'uxPickerTime',
    alternateClassName: 'uxPickerTime',
    requires: ['Ext.DateExtras', 'Ext.util.InputBlocker'],

    /**
    * @event change
    * Fired when the value of this picker has changed and the done button is pressed.
    * @param {Ext.picker.Date} this This Picker
    * @param {Date} value The date value
    */

    config: {
        /**
        * @cfg {Number} yearFrom
        * 开始年份,如果他比yearTo大，则选择顺序颠倒
        * @accessor
        */
        yearFrom: 2020,

        /**
        * @cfg {Number} [yearTo=new Date().getFullYear()]
        * 结束年份
        * @accessor
        */
        yearTo: 2012,

        /**
        * @cfg {String} monthText
        * 月显示值
        * @accessor
        */
        monthText: '月',

        /**
        * @cfg {String} dayText
        * 日显示值
        * @accessor
        */
        dayText: '日',

        /**
        * @cfg {String} yearText
        * 年显示值
        * @accessor
        */
        yearText: '年',

        /**
        * @cfg {String} hourText
        * 小时显示值
        */
        hourText: '时',

        /**
        * @cfg {String} minuteText
        * 分显示值
        */
        minuteText: '分',

        /**
        * @cfg {String} ampmText
        * 上午/下午显示值
        */
        ampmText: '上午/下午',
        /**
        * @cfg {Array} slotOrder
        * 默认的选项列表
        * @accessor
        */
        slotOrder: ['year', 'month', 'day', 'hour', 'minute'], //

        /**
        * @cfg {Int} 
        *分钟间隔
        * @accessor
        */
        minuteInterval: 1,

        /**
        * @cfg {Boolean} ampm
        *是否使用12小时制
        * @accessor
        */
        ampm: false,
        useTitles: true
    },

    platformConfig: [{
        theme: ['Windows'],
        doneButton: {
            iconCls: 'check2',
            ui: 'round',
            text: ''
        }
    }],

    initialize: function () {
        this.callParent();

        this.on({
            scope: this,
            delegate: '> slot',
            slotpick: this.onSlotPick
        });

        this.on({
            scope: this,
            show: this.onSlotPick
        });
    },

    setValue: function (value, animated) {
        if (Ext.isDate(value)) {
            var ampm = 'AM',
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

        this.callParent([value, animated]);
        this.onSlotPick();
    },
    //获取值
    getValue: function (useDom) {
        var values = {},
            items = this.getItems().items,
            ln = items.length,
            daysInMonth, day, month, year, hour, minute, item, i;

        for (i = 0; i < ln; i++) {
            item = items[i];
            if (item instanceof Ext.picker.Slot) {
                values[item.getName()] = item.getValue(useDom);
            }
        }

        //if all the slots return null, we should not return a date
        if (values.year === null && values.month === null && values.day === null && values.hour === null && values.minute === null) {
            return null;
        }

        year = Ext.isNumber(values.year) ? values.year : 1;
        month = Ext.isNumber(values.month) ? values.month : 1;
        day = Ext.isNumber(values.day) ? values.day : 1;
        hour = Ext.isNumber(values.hour) ? values.hour : 1;
        minute = Ext.isNumber(values.minute) ? values.minute : 1;

        if (month && year && month && day) {
            daysInMonth = this.getDaysInMonth(month, year);
        }
        day = (daysInMonth) ? Math.min(day, daysInMonth) : day;
        if (values.ampm && values.ampm == "PM" && hour < 12) {
            hour = hour + 12;
        }
        if (values.ampm && values.ampm == "AM" && hour == 12) {
            hour = 0;
        }
        return new Date(year, month - 1, day, hour, minute);
    },

    /**
    * Updates the yearFrom configuration
    */
    updateYearFrom: function () {
        if (this.initialized) {
            this.createSlots();
        }
    },

    /**
    * Updates the yearTo configuration
    */
    updateYearTo: function () {
        if (this.initialized) {
            this.createSlots();
        }
    },

    /**
    * Updates the monthText configuration
    */
    updateMonthText: function (newMonthText, oldMonthText) {
        var innerItems = this.getInnerItems,
            ln = innerItems.length,
            item, i;

        //loop through each of the current items and set the title on the correct slice
        if (this.initialized) {
            for (i = 0; i < ln; i++) {
                item = innerItems[i];

                if ((typeof item.title == "string" && item.title == oldMonthText) || (item.title.html == oldMonthText)) {
                    item.setTitle(newMonthText);
                }
            }
        }
    },

    /**
    * Updates the {@link #dayText} configuration.
    */
    updateDayText: function (newDayText, oldDayText) {
        var innerItems = this.getInnerItems,
            ln = innerItems.length,
            item, i;

        //loop through each of the current items and set the title on the correct slice
        if (this.initialized) {
            for (i = 0; i < ln; i++) {
                item = innerItems[i];

                if ((typeof item.title == "string" && item.title == oldDayText) || (item.title.html == oldDayText)) {
                    item.setTitle(newDayText);
                }
            }
        }
    },

    /**
    * Updates the yearText configuration
    */
    updateYearText: function (yearText) {
        var innerItems = this.getInnerItems,
            ln = innerItems.length,
            item, i;

        //loop through each of the current items and set the title on the correct slice
        if (this.initialized) {
            for (i = 0; i < ln; i++) {
                item = innerItems[i];

                if (item.title == this.yearText) {
                    item.setTitle(yearText);
                }
            }
        }
    },

    // @private
    constructor: function () {
        this.callParent(arguments);
        this.createSlots();
    },

    /**
    * Generates all slots for all years specified by this component, and then sets them on the component
    * @private
    */
    createSlots: function () {
        var me = this,
            slotOrder = me.getSlotOrder(),
            yearsFrom = me.getYearFrom(),
            yearsTo = me.getYearTo(),
            years = [],
            days = [],
            months = [],
               hours = [],
            minutes = [],
            ampm = [],
            reverse = yearsFrom > yearsTo,
            ln, i, daysInMonth;

        if (!this.getAmpm()) {
            var index = slotOrder.indexOf('ampm')
            if (index >= 0) {
                slotOrder.splice(index);
            }
        }
        //填充年列表
        while (yearsFrom) {
            years.push({
                text: yearsFrom,
                value: yearsFrom
            });

            if (yearsFrom === yearsTo) {
                break;
            }

            if (reverse) {
                yearsFrom--;
            } else {
                yearsFrom++;
            }
        }
        //填充天列表
        daysInMonth = me.getDaysInMonth(1, new Date().getFullYear());

        for (i = 0; i < daysInMonth; i++) {
            days.push({
                text: i + 1,
                value: i + 1
            });
        }
        //填充月列表
        for (i = 0, ln = Ext.Date.monthNames.length; i < ln; i++) {
            months.push({
                text: Ext.Date.monthNames[i],
                value: i + 1
            });
        }
        //填充小时列表
        var hourLimit = (this.getAmpm()) ? 12 : 23
        var hourStart = (this.getAmpm()) ? 1 : 0
        for (i = hourStart; i <= hourLimit; i++) {
            hours.push({
                text: this.pad2(i),
                value: i
            });
        }
        //填充分钟列表
        for (i = 0; i < 60; i += this.getMinuteInterval()) {
            minutes.push({
                text: this.pad2(i),
                value: i
            });
        }
        //填充上午/下午
        ampm.push({
            text: '上午',
            value: 'AM'
        }, {
            text: '下午',
            value: 'PM'
        });

        var slots = [];

        slotOrder.forEach(function (item) {
            slots.push(me.createSlot(item, days, months, years, hours, minutes, ampm));
        });

        me.setSlots(slots);
    },

    /**
    * Returns a slot config for a specified date.
    * @private
    */
    createSlot: function (name, days, months, years, hours, minutes, ampm) {
        switch (name) {
            case 'year':
                return {
                    name: 'year',
                    align: 'center',
                    data: years,
                    title: this.getYearText(),
                    flex: 3
                };
            case 'month':
                return {
                    name: name,
                    //name:'month',
                    align: 'center',
                    data: months,
                    title: this.getMonthText(),
                    flex: 3
                };
            case 'day':
                return {
                    name: 'day',
                    align: 'center',
                    data: days,
                    width: '1px',
                    title: this.getDayText(),
                    flex: 2
                };
            case 'hour':
                return {
                    name: 'hour',
                    align: 'center',
                    data: hours,
                    title: this.getHourText(),
                    flex: 2
                };
            case 'minute':
                return {
                    name: 'minute',
                    align: 'center',
                    data: minutes,
                    title: this.getMinuteText(),
                    flex: 2
                };
            case 'ampm':
                return {
                    name: 'ampm',
                    align: 'center',
                    data: ampm,
                    title: this.getAmpmText(),
                    flex: 2
                };
        }
    },

    onSlotPick: function () {
        var value = this.getValue(true),
            slot = this.getDaySlot(),
            year = value.getFullYear(),
            month = value.getMonth(),
            days = [],
            daysInMonth, i;
        if (!value || !Ext.isDate(value) || !slot) {
            return;
        }

        this.callParent(arguments);

        //get the new days of the month for this new date
        daysInMonth = this.getDaysInMonth(month + 1, year);
        for (i = 0; i < daysInMonth; i++) {
            days.push({
                text: i + 1,
                value: i + 1
            });
        }
        // We don't need to update the slot days unless it has changed
        if (slot.getStore().getCount() == days.length) {
            return;
        }

        slot.getStore().setData(days);

        // Now we have the correct amount of days for the day slot, lets update it
        var store = slot.getStore(),
            viewItems = slot.getViewItems(),
            valueField = slot.getValueField(),
            index, item;

        index = store.find(valueField, value.getDate());
        if (index == -1) {
            return;
        }

        item = Ext.get(viewItems[index]);

        slot.selectedIndex = index;
        slot.scrollToItem(item);
        slot.setValue(slot.getValue(true));


    },

    getDaySlot: function () {
        var innerItems = this.getInnerItems(),
            ln = innerItems.length,
            i, slot;

        if (this.daySlot) {
            return this.daySlot;
        }

        for (i = 0; i < ln; i++) {
            slot = innerItems[i];
            if (slot.isSlot && slot.getName() == "day") {
                this.daySlot = slot;
                return slot;
            }
        }

        return null;
    },

    // @private
    getDaysInMonth: function (month, year) {
        var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return month == 2 && this.isLeapYear(year) ? 29 : daysInMonth[month - 1];
    },

    // @private
    isLeapYear: function (year) {
        return !!((year & 3) === 0 && (year % 100 || (year % 400 === 0 && year)));
    },

    onDoneButtonTap: function () {
        var oldValue = this._value,
            newValue = this.getValue(true),
            testValue = newValue;

        if (Ext.isDate(newValue)) {
            testValue = newValue.toDateString();
        }
        if (Ext.isDate(oldValue)) {
            oldValue = oldValue.toDateString();
        }
        if (testValue != oldValue) {
            this.fireEvent('change', this, newValue);
        }
        this.hide();
        Ext.util.InputBlocker.unblockInputs();
    },
    pad2: function (number) {
        return (number < 10 ? '0' : '') + number;
    }
});