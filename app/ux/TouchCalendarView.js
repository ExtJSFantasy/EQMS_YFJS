/**
 * @copyright     (c) 2012, by SwarmOnline.com
 * @date          29th May 2012
 * @version       0.1
 * @documentation
 * @website        http://www.swarmonline.com
 */
/**
 * @class UX.TouchCalendarView
 * @author Stuart Ashworth
 *
 * For use with Sencha Touch 2
 *
 */
Ext.define('UX.TouchCalendarViewModel', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'date',
        fields: [
            { name: 'date', type: 'date' },
            { name: 'today', type: 'boolean' },
            { name: 'selected', type: 'boolean' },
            { name: 'prevMonth', type: 'boolean' },
            { name: 'nextMonth', type: 'boolean' },
            { name: 'weekend', type: 'boolean' },
            { name: 'festival' }
        ]
    }
});
Ext.define('UX.TouchCalendarView', {

    extend: 'Ext.Component',

    alias: 'widget.touchcalendarview',

    requires: ['UX.util.Calendar'],

    config: {

        /*scrollable: {
            direction: 'vertical',
            directionLock: true
        },*/

        /**
        * cfg {Number} weekStart Starting day of the week. (0 = Sunday, 1 = Monday ... etc)
        */
        weekStart: 1,

        /**
        * @cfg {String} todayCls CSS class added to the today's date cell
        */
        todayCls: 'today',

        /**
        * @cfg {String} selectedItemCls CSS class added to the date cell that is currently selected
        */
        selectedItemCls: 'selected',

        /**
        * @cfg {String} prevMonthCls CSS class added to any date cells that are part of the previous month
        */
        prevMonthCls: 'prev-month',

        /**
        * @cfg {String} nextMonthCls CSS class added to any date cells that are part of the next month
        */
        nextMonthCls: 'next-month',

        /**
        * @cfg {String} weekendCls CSS class added to any date cells that are on the weekend
        */
        weekendCls: 'weekend',

        timeSlotDateTpl: '{date:date("j")}',

        baseDate: null,
        value: null, //selected date

        store: null,

        baseTpl: [
            '<table class="week">',
                '<tr class="time-block-row" rowidx="0">',
                '<tpl for=".">',

                    '<td class="time-block {[this.getClasses(values)]}" datetime="{[this.me.getDateAttribute(values.date)]}">',
                        '<div class="tdinner-wrapper">',
                            '<div class="tdinner">',
                                '<span class="verticalAlign"></span>',
                                '<div class="content">',
                                    '<div class="day">{date:this.formatDate()}</div>',
                                    '<div class="festival">{festival}</div>',
                                '</div>',
                            '</div>',
                        '</div>',
                    '</td>',

                    '<tpl if="this.isEndOfRow(xindex)">',
                        '</tr>',
                        '<tpl if="!this.isEndOfPeriod(xindex, xcount)">',
                            '<tr rowidx="{[xindex / 7]}">',
                        '</tpl>',
                    '</tpl>',

                '</tpl>',
            '</table>'
        ],

        itemSelector: 'td.time-block'
    },

    applyBaseDate: function(date){
        return Ext.Date.clearTime(date || new Date());
    },

    /**
    * Creates an Ext.XTemplate instance for any TimeSlotDateTpl that are defined as strings.
    * @method
    * @private
    * @param {Object} value
    * @return {Object}
    */
    applyTimeSlotDateTpl: function(value) {
        if (Ext.isString(value)) {
            return Ext.create('Ext.XTemplate', value);
        }
        return value;
    },

    /**
    * Object containing common functions to be passed to XTemplate for internal use
    * @property {Object} commonTplFuns
    * @private
    */
    commonTplFuns: {

        /**
        * Uses the templates defined in the 'timeSlotDateTpl' config to format the date HTML.
        * @method
        * @private
        * @param {Date} date The date for the current time slot.
        * @return {String} HTML output from date template
        */
        formatDate: function(date) {
            return this.me.getTimeSlotDateTpl().apply({ date: date });
        },

        /**
        * Gets the classes that should be applied to the current day's cell
        * @method
        * @private
        * @param {Object} values
        * @return {String}
        */
        getClasses: function(values) {
            var classes = [];

            if (values.selected) {
                classes.push(this.me.getSelectedItemCls());
            }
            if (values.prevMonth) {
                classes.push(this.me.getPrevMonthCls());
            }
            if (values.nextMonth) {
                classes.push(this.me.getNextMonthCls());
            }
            if (values.weekend) {
                classes.push(this.me.getWeekendCls());
            }
            if (values.today) {
                classes.push(this.me.getTodayCls());
            }

            return classes.join(' ');
        },

        /**
        * Returns true if the specific index is at the end of the row
        * Used to determine if a row terminating tag is needed
        * @method
        * @private
        * @param {Number} currentIndex
        * @return {Boolean}
        */
        isEndOfRow: function(currentIndex) {
            return (currentIndex % 7) === 0 && (currentIndex > 0);
        },

        /**
        * Returns true if the specific index is at the start of the row.
        * USed to determine whether if a row opening tag is needed
        * @method
        * @private
        * @param {Number} currentIndex
        * @return {Boolean}
        */
        isStartOfRow: function(currentIndex) {
            return ((currentIndex - 1) % 7) === 0 && (currentIndex - 1 >= 0);
        },

        isEndOfPeriod: function(currentIndex, xcount) {
            return currentIndex == xcount;
        },

        /**
        * Gets an array containing the first 7 dates to be used in headings
        * @method
        * @private
        * @param {Object} values
        * @return {Date[]}
        */
        getDaysArray: function(values) {
            var daysArray = [],
                i;

            for (i = 0; i < this.me.periodRowDayCount; i++) {
                daysArray.push(values[i]);
            }

            return daysArray;
        }
    },

    /**
    * Override of onRender method. Attaches event handlers to the element to handler
    * day taps and period switch taps
    * @method
    * @private
    * @return {void}
    */
    initialize: function() {
       // console.log("initialize");
        this.addCls(['touch-calendar-view', 'month']);

        var store = Ext.create('Ext.data.Store', {
            model: 'UX.TouchCalendarViewModel'
        });

        this.setStore(store);

        this.element.on({
            tap: 'onTimeSlotTap',
            scope: this,
            delegate: this.getItemSelector()
        });

        Ext.apply(this.commonTplFuns, { me: this })

        // Create the template
        this.setTpl(new Ext.XTemplate(this.getBaseTpl().join(''), this.commonTplFuns));

        this.refresh();

        this.callParent();
    },

    destroy: function() {
        var store = this.getStore();
        this.callParent(arguments);
        if (store)
            store.destroy();
    },

    /**
    * Builds a collection of dates that need to be rendered in the current configuration
    * @method
    * @private
    * @return {void}
    */
    populateStore: function() {
        var baseDate = this.getBaseDate(), // date to use as base
            iterDate = this.getStartDate(baseDate), // date current mode will start at
            totalDays = this.getTotalDays(baseDate), // total days to be rendered in current mode
            store = this.getStore(),
            record;

        store.suspendEvents();
        store.data.clear();

        var todayMS = Ext.Date.clearTime(new Date()).getTime(),
            valMS = !this.getValue() ? 0 : Ext.Date.clearTime(this.getValue(), true).getTime();
        // create dates based on startDate and number of days to render
        for (var i = 0; i < totalDays; i++) {

            // increment the date by one day (except on first run)
            iterDate = this.getNextIterationDate(iterDate, (i === 0 ? 0 : 1));
            var iterMS = Ext.Date.clearTime(iterDate, true).getTime();

            record = Ext.create(store.getModel(), {
                //today: this.isSameDay(iterDate, today),
                //selected: this.isSameDay(iterDate, val),
                today: iterMS == todayMS,
                selected: iterMS == valMS,
                prevMonth: (iterDate.getMonth() < baseDate.getMonth()),
                nextMonth: (iterDate.getMonth() > baseDate.getMonth()),
                weekend: this.isWeekend(iterDate),
                date: iterDate,
                festival: UX.util.Calendar.getFestival(iterDate)
            });

            store.add(record);
        }

        store.resumeEvents(true);
    },

    /**
    * Returns the current view's minimum and maximum date collection objects
    * @method
    * @private
    * @return {Object} Object in the format {min: {}, max: {}}
    */
    getPeriodMinMaxDate: function() {
        return {
            min: this.getStore().data.first(),
            max: this.getStore().data.last()
        };
    },

    /**
    * Handler for taps on the Calendar's timeslot elements.
    * Processes the tapped element and selects it visually then fires the selectionchange event
    * @method
    * @private
    * @param {Ext.EventObject} e The taps event object
    * @return {void}
    */
    onTimeSlotTap: function(e) {
        var target = Ext.fly(e.getTarget());

        this.selectCell(target);

        var newDate = this.getCellDate(target),
            previousValue = this.getValue() || this.getBaseDate();

        // don't fire the event if the values are the same
        if (newDate.getTime() !== previousValue.getTime()) {
            this.setValue(newDate);

            this.fireEvent('selectionchange', this, newDate, previousValue);
        }
    },

    /**
    * Override for the Ext.DataView's refresh method. Repopulates the store, calls parent then sync the height of the table
    * @method
    */
    refresh: function() {
        this.populateStore();

        var records = this.getStore().getRange();
        this.setData(Ext.pluck(records, 'data'));
    },

    /**
    * Selects the specified cell
    * @method
    * @param {Ext.Element} cell
    */
    selectCell: function(cell) {
        var selCls = this.getSelectedItemCls();

        var selectedEl = this.element.select('.' + selCls);

        if (selectedEl) {
            selectedEl.removeCls(selCls);
        }

        cell.addCls(selCls);

        cell.up('tr').addCls(selCls);
    },

    getSelectedCell: function() {
        var selCls = this.getSelectedItemCls();
        return this.element.down('td.time-block.' + selCls);
    },

    getTodayCell: function() {
        var cls = this.getTodayCls();
        return this.element.down('td.time-block.' + cls);
    },

    getSelectedDate: function() {
        var cell = this.getSelectedCell();
        return cell ? this.getCellDate(cell) : null;
    },

    getTodayDate: function() {
        var cell = this.getTodayCell();
        return cell ? this.getCellDate(cell) : null;
    },

    /**
    * Returns the TouchCalendarViewModel model instance containing the passed in date
    * @method
    * @private
    * @param {Date} date
    */
    getDateRecord: function(date) {
        return this.getStore().findBy(function(record) {
            var recordDate = Ext.Date.clearTime(record.get('date'), true).getTime();

            return recordDate === Ext.Date.clearTime(date, true).getTime();
        }, this);
    },

    /**
    * Returns the same day
    * @method
    * @private
    * @param {Date} date
    * @return {Date}
    */
    getDayStartDate: function(date) {
        return date;
    },

    /**
    * Returns true if the two dates are the same date (ignores time)
    * @method
    * @private
    * @param {Date} date1
    * @param {Date} date2
    * @return {Boolean}
    */
    /*isSameDay: function(date1, date2) {
        if (!date1 || !date2) {
            return false;
        }
        return Ext.Date.clearTime(date1, true).getTime() === Ext.Date.clearTime(date2, true).getTime();
    },*/

    /**
    * Returns true if the specified date is a Saturday/Sunday
    * @method
    * @private
    * @param {Object} date
    * @return {Boolean}
    */
    isWeekend: function(date) {
        return date.getDay() === 0 || date.getDay() === 6;
    },

    /**
    * Returns the last day of the week based on the specified date.
    * @method
    * @private
    * @param {Date} date
    * @return {Date}
    */
    getWeekendDate: function(date) {
        var dayOffset = date.getDay() - this.getWeekStart();
        dayOffset = dayOffset < 0 ? 6 : dayOffset;

        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + dayOffset);
    },

    /**
    * Returns the Date associated with the specified cell
    * @method
    * @param {Ext.Element} dateCell
    * @return {Date}
    */
    getCellDate: function(dateCell) {
        var date = dateCell.dom.getAttribute('datetime');
        return this.stringToDate(date);
    },

    /**
    * Returns the cell representing the specified date
    * @method
    * @param {Ext.Element} date
    * @return {Ext.Element}
    */
    getDateCell: function(date) {
        return this.element.down('td[datetime="' + this.getDateAttribute(date) + '"]');
    },

    /**
    * Returns a string format of the specified date
    * Used when assigning the datetime attribute to a table cell
    * @method
    * @private
    * @param {Date} date
    * @return {String}
    */
    getDateAttribute: function(date) {
        return Ext.Date.format(date, this.dateAttributeFormat);
    },

    /**
    * Converts a string date (used to add to table cells) to a Date object
    * @method
    * @private
    * @param {String} dateString
    * @return {Date}
    */
    stringToDate: function(dateString) {
        return Ext.Date.parseDate(dateString, this.dateAttributeFormat);
    },



    dateAttributeFormat: 'Y-m-d',

    /**
    * Called during the View's Store population. This calculates the next date for the current period.
    * The MONTH mode's version just adds 1 (or 0 on the first iteration) to the specified date. 
    * @param {Date} d Current Iteration date
    * @param {Number} index
    */
    getNextIterationDate: function(d, index) {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate() + (index === 0 ? 0 : 1));
    },

    /**
    * Returns the total number of days to be shown in this view.
    * @method
    * @private
    * @param {Date} date
    */
    getTotalDays: function(date) {
        var firstDate = Ext.Date.getFirstDateOfMonth(date);

        return this.isWeekend(firstDate) ? 42 : 35;
    },

    /**
    * Returns the first day that should be visible for a month view (may not be in the same month)
    * Gets the first day of the week that the 1st of the month falls on.
    * @method
    * @private
    * @param {Date} date
    * @return {Date}
    */
    getStartDate: function(date) {
        var fdate = new Date(date.getFullYear(), date.getMonth(), 1),
            dayOffset = fdate.getDay() - this.getWeekStart();
        dayOffset = dayOffset < 0 ? 6 : dayOffset;

        return new Date(fdate.getFullYear(), fdate.getMonth(), fdate.getDate() - dayOffset);
    },

    /**
    * Returns a new date based on the date passed and the delta value for MONTH view.
    * @method
    * @private
    * @param {Date} date
    * @param {Number} delta
    * @return {Date}
    */
    getDeltaDate: function(date, delta) {
        var newMonth = date.getMonth() + delta,
                newDate = new Date(date.getFullYear(), newMonth, 1);

        newDate.setDate(Ext.Date.getDaysInMonth(newDate) < date.getDate() ? Ext.Date.getDaysInMonth(newDate) : date.getDate());

        return newDate;
    },

    periodRowDayCount: 7
});

