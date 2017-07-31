/**
 * @copyright     (c) 2012, by SwarmOnline.com
 * @date          29th May 2012
 * @version       0.1
 * @documentation  
 * @website        http://www.swarmonline.com
 */
/**
 * @class UX.TouchCalendar
 * @author Stuart Ashworth
 *
 * For use with Sencha Touch 2
 * 
 * This extension wraps the UX.TouchCalendarView in a Ext.Carousel component and allows the calendar to respond to swipe
 * gestures to switch the displayed period. It works by creating 3 UX.TouchCalendarViews and dynamically creating/removing
 * views as the user moves back/forward through time. 
 * 
 * ![UX.TouchCalendar Screenshot](http://www.swarmonline.com/UX.TouchCalendar/screenshots/UX.TouchCalendar-month-ss.png)
 * 
 * [UX.TouchCalendar Demo](http://www.swarmonline.com/wp-content/uploads/UX.TouchCalendar/examples/UX.TouchCalendar.html)
 * 
 */
Ext.define('UX.TouchCalendar',{
	extend: 'Ext.carousel.Carousel',

	xtype: 'calendar',

	config: {

	    directionLock: false,
		indicator: false,

		/**
		* @cfg {Boolean/Object} enableSimpleEvents True to enable the UX.TouchCalendarSimpleEvents plugin. When true the UX.TouchCalendarSimpleEvents JS and CSS files
		* must be included and an eventStore option, containing an Ext.data.Store instance, be given to the viewConfig. If an object is passed in this is used as the config for the plugin.
		*/
		enableSimpleEvents: false,

		/**
		* @cfg {Object} viewConfig A set of configuration options that will be applied to the TouchCalendarView component
		*/
		viewConfig: {},

		eventStore: null
	},

	defaultViewConfig: {
		weekStart: 1,
		bubbleEvents: ['selectionchange']
	},


    applyViewConfig: function(viewConfig) {
        if (!viewConfig) {
            viewConfig = {};
        }

        return Ext.applyIf(viewConfig, this.defaultViewConfig);
    },

	applyEventStore: function(store){
        if (store) {
            store = Ext.data.StoreManager.lookup(store);
        }

        return store;
	},

	initialize: function(){
		this.initViews();
		//console.log(9999999);
		if(this.getEnableSimpleEvents()){
			var config = Ext.isObject(this.getEnableSimpleEvents()) ? this.getEnableSimpleEvents() : {};
			
			this.addPlugins(this, Ext.create('UX.TouchCalendarSimpleEvents', config));
		} 
		this.on('activeitemchange', this.onActiveItemChange);
	},
    addPlugins: function(cmp, plugins){
        var ps = cmp.getPlugins(),
            toAdds = Ext.isArray(plugins) ? plugins : [plugins];
        if (!ps)
            cmp.setPlugins(toAdds);
        else {
            Ext.each(toAdds, function(p){
                if(!(p instanceof Ext.Base)) {
                    p = Ext.factory(p, 'Ext.plugin.Plugin', null, 'plugin');
                }
                ps.push(p);
                p.init(cmp);
            });
        }
    },

	getViewDate: function(date, i){
		return Ext.Date.add(date, Ext.Date.MONTH, i)
	},

	/**
	 * Creates all the TouchCalendarView instances needed for the Calendar
	 * @method
	 * @private
	 * @return {void}
	 */
	initViews: function(){
		var items = [],
			viewConfig = this.getViewConfig(),
			origBaseDate = new Date();

		// first out of view
		var viewValue = this.getViewDate(origBaseDate, -1);
		items.push(
			Ext.applyIf({
				xtype: 'touchcalendarview',
				baseDate: viewValue
			}, viewConfig)
		);

		// active view
		items.push(
			Ext.applyIf({
				xtype: 'touchcalendarview',
				baseDate: origBaseDate
			}, viewConfig)
		);

		// second out of view (i.e. third)
		viewValue = this.getViewDate(origBaseDate, 1);
		items.push(
			Ext.applyIf({
				xtype: 'touchcalendarview',
				baseDate: viewValue
			}, viewConfig)
		);

		this.setItems(items);
		this.setActiveItem(1); 
		
		this.getActiveItem().on({
			painted: function(){
				this.element.setHeight(this.getActiveItem().element.down('table').getHeight());
			},
			single: true,
			scope: this
		});
	},

	/**
	* Returns the Date that is selected.
	* @method
	* @returns {Date} The selected date
	*/
	getValue: function(){
		return this.getActiveItem().getValue();
	},

	/**
	* Set selected date.
	* @method
	* @param {Date} v Date to select.
	* @return {void}
	*/
	setValue: function(v) {
		this.getActiveItem().setValue(v)
	},

	/**
	 * Override of the onCardSwitch method which adds a new card to the end/beginning of the carousel depending on the direction configured with the next period's
	 * dates.
	 * @method
	 * @private
	 */
	onActiveItemChange: function(container, newCard, oldCard){
		var items = this.getItems(),
			newIndex = items.indexOf(newCard), 
			oldIndex = items.indexOf(oldCard), 
			direction = (newIndex > oldIndex) ? 'forward' : 'backward';

		if (direction === 'forward') {
			this.remove(items.get(0));
			var newCalendar = Ext.widget('touchcalendarview', Ext.applyIf({
				baseDate: this.getViewDate(newCard.getBaseDate(), 1)
			}, this.getViewConfig()));

			this.add(newCalendar);
		}
		else {
			this.remove(items.get(items.getCount() - 1));
			var newCalendar = Ext.widget('touchcalendarview', Ext.applyIf({
				baseDate: this.getViewDate(newCard.getBaseDate(), -1)
			}, this.getViewConfig()));
			this.insert(0, newCalendar);
		}

		this.element.setHeight(newCard.element.down('table').getHeight());

		var dateRange = newCard.getPeriodMinMaxDate();
		this.fireEvent('periodchange', this, dateRange.min.get('date'), dateRange.max.get('date'), direction);
		this.fireEvent('refresh', this, newCard.getBaseDate());
	},
    setOffsetAnimated: function(offset){
        this.callParent(arguments);
        var idx = (this.getActiveIndex() - this.animationDirection) % 3;
        this.fireEvent('refresh', this, this.getInnerAt(idx).getBaseDate());
    }
});
