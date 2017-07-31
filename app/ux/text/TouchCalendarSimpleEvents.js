/**
 * @copyright     (c) 2012, by SwarmOnline.com
 * @date          29th May 2012
 * @version       0.1
 * @documentation
 * @website        http://www.swarmonline.com
 */
/**
 * @class UX.TouchCalendarSimpleEvents
 * @author Stuart Ashworth
 *
 * For use with Sencha Touch 2
 *
 * This plugin can be added to an UX.TouchCalendarView instance to allow a store to be bound to the calendar so events can be shown in a similar style to the iPhone
 * does with a dot added to each day to represent the presence of an event.
 * 
 * ![UX.TouchCalendarSimpleEvents Screenshot](http://www.swarmonline.com/UX.TouchCalendar/screenshots/UX.TouchCalendarSimpleEvents-month-ss.png)
 * 
 * # Sample Usage
 * 
 *     Ext.regModel('Event', {
           fields: [{
               name: 'event',
               type: 'string'
           }, {
               name: 'location',
               type: 'string'
           }, {
               name: 'start',
               type: 'date',
               dateFormat: 'c'
           }, {
               name: 'end',
               type: 'date',
               dateFormat: 'c'
           }]
       });
       
       var calendar = new Ext.ux.Calendar({
           mode: 'month',
           weekStart: 1,
           value: new Date(),
           
           store: new Ext.data.Store({
		        model: 'Event',
		        data: [{
		            event: 'Sencha Con',
		            location: 'Austin, Texas',
		            start: new Date(2011, 9, 23),
		            end: new Date(2011, 9, 26)
		        }]
		    },
                        
           plugins: [new Ext.ux.CalendarSimpleEvents()]
       });
 *    
 * # Demo
 * [Ext.ux.CalendarSimpleEvents Demo](http://www.swarmonline.com/UX.TouchCalendar/examples/Ext.ux.CalendarSimpleEvents.html)
 */
Ext.define('UX.TouchCalendarSimpleEvents', {
	extend: 'Ext.mixin.Observable',
	
	config: {
		/**
		 * @cfg {String} startEventField Name of the Model field which contains the Event's Start date
		 */
		startEventField: 'start',
		
		/**
		 * @cfg {Stirng} endEventField Name of the Model field which contains the Event's End date
		 */
		endEventField: 'end',
		
		/**
		 * @cfg {String} eventTpl Template used to create the Event markup. Template is merged with the records left
		 * following the filter
		 */
		eventTpl: [
				//'<div class="{eventDotCls} {[values.color != null && values.color != \'\' ? (values.color == \'green\' ? \'green\' : (values.color == \'red\' ? \'red\' : \'yellow\')) : \'\']}" ></div>'
				//'<div class="{eventDotCls} {[values.color == \'\' ?  \'gray\':(values.color == \'green\' ? \'green\' : (values.color == \'red\' ? \'red\' : (values.color == \'emp\' || values.color == null ? \'null\': \'yellow\')))]}" ></div>'
				'<div class="{eventDotCls} {[values.color == \'\' ?  \'gray\':(values.color == \'green\' ? \'green\' : (values.color == \'red\' ? \'red\' : (values.color == \'purple\' ? \'purple\':(values.color == \'emp\' || values.color == null ? \'null\': \'yellow\'))))]}" ></div>'				
		].join('')
	},
	
	/**
	 * @cfg {String} eventDotCls CSS class that is added to the event dot element itself. Used to provide
	 * the dots' styling
	 */
	eventDotCls: 'simple-event',
	
	applyEventTpl: function(tpl){
		if(Ext.isString(tpl))
			return Ext.create('Ext.XTemplate', tpl, { compiled: true });
		return tpl;
	},
		
	init: function(calendar){
		this.calendar = calendar; // cache the parent calendar
		this.calendar.simpleEventsPlugin = this; // cache the plugin instance on the calendar itself
		
		this.calendar.showEvents = this.showEvents;
		this.calendar.hideEvents = this.hideEvents;
		this.calendar.getEventsByDate = Ext.Function.bind(this.getEventsByDate, this);
		
		var store = this.calendar.getEventStore();		
		store.on({
            scope: this,
            addrecords: 'refreshEvent',
            removerecords: 'refreshEvent',
            updaterecord: 'refreshEvent',
            refresh: 'refreshEvents'
        });
		this.calendar.on({
			destroy: 'onCalendarDestroy',
			scope: this
		});
	},
	onCalendarDestroy: function(){
		var store = this.calendar.getEventStore();
		store.un({
            scope: this,
            addrecords: 'refreshEvent',
            removerecords: 'refreshEvent',
            updaterecord: 'refreshEvent',
            refresh: 'refreshEvents'
        });
	},
	
	isDateInArr: function(v, arr){
		for(var i = 0;i<arr.length;i++) {
			if(arr[i] - v == 0) return true;
		}
		return false;
	},
	
	refreshEvent: function(store, records){
		var startField = this.getStartEventField(),
			endField = this.getEndEventField(),
			arr = [];
		Ext.each(records, function(record){
			if(!record.data._start) 
				record.data._start = Ext.Date.clearTime(record.get(startField), true);
			if(!record.data._end) 
				record.data._end = Ext.Date.clearTime(record.get(endField), true);
			var s = Ext.clone(record.data._start),
				e = record.data._end;
			
			while(s - e <= 0) {
				if(!this.isDateInArr(s, arr))
					arr.push(Ext.clone(s));

				s.setDate(s.getDate() + 1);
			}
		}, this);
		Ext.each(arr, function(date){
			this.refreshOneDate(date);
		}, this);

	    var calendarview = this.calendar.getActiveItem(),
	        date = calendarview.getSelectedDate() || calendarview.getTodayDate();
	    if (date)
	        calendarview.fireEvent('selectionchange', calendarview, date, null);
	},
	
	/**
	 * Function to execute when the Calendar is refreshed.
	 * It loops through the Calendar's current dateCollection and gets all Events
	 * for the current date and inserts the appropriate markup
	 * @method
	 * @private
	 * @return {void}
	 */
	refreshEvents: function(){
		//debugger
		if (this.calendar.getEventStore().getCount()) {
			
			var datesStore = this.calendar.getActiveItem().getStore();
			if (datesStore) {
				// loop through Calendar's current dateCollection
				datesStore.each(function(dateObj){
					var date = dateObj.get('date');
					this.refreshOneDate(date);
				}, this);
			}
		}

	    var calendarview = this.calendar.getActiveItem(),
	        date = calendarview.getSelectedDate() || calendarview.getTodayDate();
	    if (date)
	        calendarview.fireEvent('selectionchange', calendarview, date, null);
	},
	
	refreshOneDate: function(date){
		var cell = this.calendar.getActiveItem().getDateCell(date);
		if (cell) {
			cell.select('.' + this.eventDotCls).destroy();
			
			var store = this.calendar.getEventStore(), 
				tpl = this.getEventTpl(),
				startField = this.getStartEventField(),
				endField = this.getEndEventField(),
				green = null,
				color = null,
				found = null;
			store.data.each(function(record){
				// console.log(record.data);
				if(!record.data._start) 
					record.data._start = Ext.Date.clearTime(record.get(startField), true);
				if(!record.data._end) 
					record.data._end = Ext.Date.clearTime(record.get(endField), true);
					
				if((record.data._start - date <= 0) && (record.data._end - date >= 0)) {
					found = record;
					color = record.data.color;
					if(record.get('CalendarId') == 5) {						
						green = record;
						return false;
					}
				}
			}, this);
			if(found){
				tpl.append(cell, { 
					green: !!green,
					color: color,
					eventDotCls: this.eventDotCls
				}, true);
			}
		}
	},

    getEventsByDate: function(date){
		var startField = this.getStartEventField(),
			endField = this.getEndEventField();

        var data = this.calendar.getEventStore().data.filterBy(function(record) {
            var startDate = Ext.Date.clearTime(record.get(startField), true).getTime(),
				endDate = Ext.Date.clearTime(record.get(endField), true).getTime();

            return (startDate <= date) && (endDate >= date);
        }, this);

        return data.items;
    },
	
	/**
	 * Hides all the event markers
	 * This is added to the parent Calendar's class so must be executed via the parent
	 * @method
	 * @return {void}
	 */
	hideEvents: function(){
		this.calendar.element.select('.' + this.eventDotCls).hide();
	},
	
	/**
	 * Shows all the event markers
	 * This is added to the parent Calendar's class so must be executed via the parent
	 * @method
	 * @return {void}
	 */
	showEvents: function(){
		this.calendar.element.select('.' + this.eventDotCls).show();
	}
});
