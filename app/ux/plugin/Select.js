Ext.define('UX.plugin.Select', {
    extend: 'Ext.field.Text',
    xtype: 'uxSelectfield',
    alternateClassName: 'ux.plugin.Select',
    requires: [
        'Ext.Panel',
        'Ext.picker.Picker',
        'Ext.data.Store',
        'Ext.data.StoreManager',
        'Ext.dataview.List',
		'Ext.plugin.PullRefresh',
		'Ext.plugin.ListPaging'
    ],

    /**
     * @event change
     * Fires when an option selection has changed
     * @param {Ext.field.Select} this
     * @param {Mixed} newValue The new value
     * @param {Mixed} oldValue The old value
     */

    /**
     * @event focus
     * Fires when this field receives input focus. This happens both when you tap on the field and when you focus on the field by using
     * 'next' or 'tab' on a keyboard.
     *
     * Please note that this event is not very reliable on Android. For example, if your Select field is second in your form panel,
     * you cannot use the Next button to get to this select field. This functionality works as expected on iOS.
     * @param {Ext.field.Select} this This field
     * @param {Ext.event.Event} e
     */

    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        ui: 'select',

        /**
         * @cfg {Boolean} useClearIcon
         * @hide
         */

        /**
         * @cfg {String/Number} valueField The underlying {@link Ext.data.Field#name data value name} (or numeric Array index) to bind to this
         * Select control.
         * @accessor
         */
        valueField: 'value',

        /**
         * @cfg {String/Number} displayField The underlying {@link Ext.data.Field#name data value name} (or numeric Array index) to bind to this
         * Select control. This resolved value is the visibly rendered value of the available selection options.
         * @accessor
         */
        displayField: 'text',

        /**
         * @cfg {Ext.data.Store/Object/String} store The store to provide selection options data.
         * Either a Store instance, configuration object or store ID.
         * @accessor
         */
        store: null,

        /**
         * @cfg {String} hiddenName Specify a `hiddenName` if you're using the {@link Ext.form.Panel#standardSubmit standardSubmit} option.
         * This name will be used to post the underlying value of the select to the server.
         * @accessor
         */
        hiddenName: null,

        /**
         * @cfg {Object} component
         * @accessor
         * @hide
         */
        component: {
            useMask: true
        },

        /**
         * @cfg {Boolean} clearIcon
         * @hide
         * @accessor
         */
        clearIcon: false,

        /**
         * @cfg {Boolean} autoSelect
         * `true` to auto select the first value in the {@link #store} or {@link #options} when they are changed. Only happens when
         * the {@link #value} is set to `null`.
         */
        autoSelect: true,

		oldTime: null,
        /**
         * @cfg {Object} defaultTabletPickerConfig
         * The default configuration for the picker component when you are on a tablet.
         */
        defaultTabletPickerConfig: null,

        /**
         * @cfg
         * @inheritdoc
         */
        name: 'picker',

        /**
         * @cfg {String} pickerSlotAlign
         * The alignment of text in the picker created by this Select
         * @private
         */
        pickerSlotAlign: 'center'
    },

    platformConfig: [
        {
            theme: ['Windows'],
            pickerSlotAlign: 'left'
        },
        {
            theme: ['Tizen'],
            usePicker: false
        }
    ],

    // @private
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

        if (Ext.theme.is.Blackberry) {
            this.label.on({
                scope: me,
                tap: "onFocus"
            });
        }
    },

    getElementConfig: function () {
        if (Ext.theme.is.Blackberry) {
            var prefix = Ext.baseCSSPrefix;

            return {
                reference: 'element',
                className: 'x-container',
                children: [
                    {
                        reference: 'innerElement',
                        cls: prefix + 'component-outer',
                        children: [
                            {
                                reference: 'label',
                                cls: prefix + 'form-label',
                                children: [{
                                    reference: 'labelspan',
                                    tag: 'span'
                                }]
                            }
                        ]
                    }
                ]
            };
        } else {
            return this.callParent(arguments);
        }
    },


    /**
     * @private
     */
    updateDefaultTabletPickerConfig: function (newConfig) {
        var listPanel = this.listPanel;
        if (listPanel) {
            listPanel.setConfig(newConfig);
        }
    },


    syncEmptyCls: Ext.emptyFn,

    // @private
    getTabletPicker: function () {
        var config = this.getDefaultTabletPickerConfig();

        if (!this.listPanel) {
            this.listPanel = Ext.create('Ext.Panel', Ext.apply({
                left: 0,
                top: 0,
                modal: true,
                cls: Ext.baseCSSPrefix + 'select-overlay',
                layout: 'fit',
                hideOnMaskTap: true,
                width: Ext.os.is.Phone ? '30em' : '25em',
                height: (Ext.os.is.BlackBerry && Ext.os.version.getMajor() === 10) ? '12em' : (Ext.os.is.Phone ? '40em' : '30em'),
                items: [{
                    xtype: 'toolbar',
                    docked: 'top',
                    items: [
                        //新增的搜索栏，用于支持模糊查询
                        {
                            xtype: 'searchfield',
                            placeHolder: '请输入关键词',
                            clearIcon:false,
                            listeners: {
                                keyup: 'onSearch',
                                scope: this
                            }
                        }
                    ]
                }, {
                    xtype: 'list',
                    store: this.getStore(),
					plugins: ['pullrefresh', 'listpaging'],
                    itemTpl: [
                      '<div class="x-list-label">{' + this.getDisplayField() + ':htmlEncode}</div>'
                    ],
                    listeners: {
                        select: this.onListSelect,
                        itemtap: this.onListTap,
                        scope: this
                    }
                }]
            }, config));
        }

        return this.listPanel;
    },
    //进行模糊查询
    onSearchKeyUp: function (value) {
        //得到数据仓库和搜索关键词
        var store = this.getStore();
		
		//============================2016-07-12 张家余 修改模糊查询，直接从数据库查询数据============
		var params = {searchVal: value}
		store.setProxy({
			extraParams: params
		});
		store.load();
		//============================2016-07-12 张家余 修改模糊查询，直接从数据库查询数据=================================
       /*  //如果是新的关键词，则清除过滤
        store.clearFilter(!!value);
        //检查值是否存在
        if (value) {
            //the user could have entered spaces, so we must split them so we can loop through them all
            var key = this.getDisplayField(),
             searches = value.split(','),
                regexps = [],
                //获取现实值的name
                i, regex;

            //loop them all
            for (i = 0; i < searches.length; i++) {
                //if it is nothing, continue
                if (!searches[i]) continue;

                regex = searches[i].trim();
                regex = regex.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");

                //if found, create a new regular expression which is case insenstive
                regexps.push(new RegExp(regex.trim(), 'i'));
            }

            //now filter the store by passing a method
            //the passed method will be called for each record in the store
            store.filter(function (record) {
                var matched = [];

                //loop through each of the regular expressions
                for (i = 0; i < regexps.length; i++) {
                    var search = regexps[i],
                        didMatch = search.test(record.get(key));

                    //if it matched the first or last name, push it into the matches array
                    matched.push(didMatch);
                }

                return (regexps.length && matched.indexOf(true) !== -1);
            }); 
        }
		*/
    },
    //进行模糊查询
    onSearch: function (field, e, eop) {
		var it = this;
		it.setOldTime(e.timeStamp)
		var _search = setTimeout(function(){
			if(it.getOldTime() - e.timeStamp == 0){
				it.onSearchKeyUp(field.getValue());
			}
		},1000);
		// clearTimeout(_search);
    },
    // @private
    onMaskTap: function () {
        this.onFocus();

        return false;
    },

    /**
     * Shows the picker for the select field, whether that is a {@link Ext.picker.Picker} or a simple
     * {@link Ext.List list}.
     */
    showPicker: function () {
    // debugger
        var me = this,
            store = me.getStore(),
            value = me.getValue();

        //check if the store is empty, if it is, return
        if (!store) {
            return;
        }
        if (me.getReadOnly()) {
            return;
        }
        me.isFocused = true;

            //先过滤一下避免加载过慢
            var text = this.getValue();
            console.log("text",text);
            this.onSearchKeyUp(text);

            var listPanel = me.getTabletPicker(),
                list = listPanel.down('list'),
                index;

            if (!listPanel.getParent()) {
                Ext.Viewport.add(listPanel);
            }
            //为搜索栏赋值
            listPanel.down('searchfield').setValue(text);
            listPanel.showBy(me.getComponent(), null);
    },

    // @private
    onListSelect: function (item, record) {
        var me = this;
        if (record) {
            me.setValue(record.get(me.getValueField()));
            me.fireEvent('pickerchange', me, record);
        }
    },        

    onListTap: function () {
        this.listPanel.hide({
            type: 'fade',
            out: true,
            scope: this
        });
    },


    applyStore: function (store) {
        if (store === true) {
            store = Ext.create('Ext.data.Store', {
                fields: [this.getValueField(), this.getDisplayField()],
                autoDestroy: true
            });
        }

        if (store) {
            store = Ext.data.StoreManager.lookup(store);
        }

        return store;
    },

    updateStore: function (newStore) {
        if (this.picker) {
            this.picker.down('pickerslot').setStore(newStore);
        } else if (this.listPanel) {
            this.listPanel.down('dataview').setStore(newStore);
        }
    },

    /**
     * @private
     */
    doSetDisabled: function (disabled) {
        var component = this.getComponent();
        if (component) {
            component.setDisabled(disabled);
        }
        Ext.Component.prototype.doSetDisabled.apply(this, arguments);
    },

    /**
     * @private
     */
    setDisabled: function () {
        Ext.Component.prototype.setDisabled.apply(this, arguments);
    },

    // @private
    updateLabelWidth: function () {
        if (Ext.theme.is.Blackberry) {
            return;
        } else {
            this.callParent(arguments);
        }
    },

    // @private
    updateLabelAlign: function () {
        if (Ext.theme.is.Blackberry) {
            return;
        } else {
            this.callParent(arguments);
        }
    },


    onFocus: function (e) {
        if (this.getDisabled()) {
            return false;
        }
        var component = this.getComponent();
        this.fireEvent('focus', this, e);

        if (Ext.os.is.Android4) {
            component.input.dom.focus();
        }
        component.input.dom.blur();

        this.isFocused = true;

        this.showPicker();
    },

    destroy: function () {
        this.callParent(arguments);
        var store = this.getStore();

        if (store && store.getAutoDestroy()) {
            Ext.destroy(store);
        }

        Ext.destroy(this.listPanel, this.picker);
    }
});