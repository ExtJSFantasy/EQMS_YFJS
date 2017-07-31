//下方有一条横线的tabbar
Ext.define('UX.tab.LineBar', {
    extend: 'Ext.dataview.DataView',
    xtype: 'linetabbar',
    config: {
        value: null,
        valueField: 'value',

        loadingText: null,
        inline: { wrap: false },
        itemTpl: '{text}',
        scrollable: {
            direction: 'horizontal',
            directionLock: true,
            indicators: false
        },

        carousel: null
    },
    updateCarousel: function(carousel, oldCarousel){
        var me = this;

        if(carousel){
            carousel.on({
                activeitemchange: 'carouselActiveItemChange',
                scope: me
            });
            carousel.element.on({
                drag: 'carouselDrag',
                scope: me
            });
            carousel.getTranslatable().on({
                animationframe: 'carouselAnimation',
                scope: me
            });
        }
        if(oldCarousel){
            oldCarousel.un({
                activeitemchange: 'carouselActiveItemChange',
                scope: me
            });
            oldCarousel.element.un({
                drag: 'carouselDrag',
                scope: me
            });
            oldCarousel.getTranslatable().un({
                animationframe: 'carouselAnimation',
                scope: me
            });
        }
    },
    carouselActiveItemChange: function(carousel, item, oldItem){
        var index = carousel.innerItems.indexOf(item);
        this.select(index);
    },
    carouselDrag: function(e){
        this.doLineTransalte(this.getCarousel().offset);
    },
    carouselAnimation: function(t, x, y){
        this.doLineTransalte(x);
    },
    doLineTransalte: function(x){
        var me = this,
            width = me.getCarousel().element.getWidth(),
            rate = x / width,
            offset = -me.underLineWidth * rate;

        me.underLine.translate(me.underLineX + offset, 0);

        /*var cur = this.element.dom.querySelector('.x-dataview-item.x-item-selected'),
            scale = 1;
        if(cur){
            var w1 = Ext.fly(cur).getWidth(),
                w2;
            if(x < 0){ //下一个
                var next = cur.nextSibling;
                w2 = Ext.fly(next).getWidth();
            }
            else{ //上一个
                var prev = cur.previousSibling;
                w2 = Ext.fly(prev).getWidth();
            }
            scale = ((w2 - w1) * rate) / w1 + 1
        }

        var transformStyleName = 'webkitTransform' in document.createElement('div').style ? 'webkitTransform' : 'transform';
        me.underLine.dom.style[transformStyleName] = 'translate3d(' + (me.underLineX + offset) + 'px, 0px, 0px) scaleX(' + scale + ')';*/

    },

    updateValue: function(value, oldValue){
        var me = this,
            store = me.getStore(),
            index = -1;
        if(!store) return;

        if(!Ext.isEmpty(value)){
            index = store.find(me.getValueField(), value, null, null, null, true);
        }
        if (index == -1 && store.getCount() > 0) {
            index = 0;
        }
        if (index >= 0){
            var ss = me.getSelection(),
                rec = store.getAt(index),
                force = ss.length && ss[0] === rec;
            me.select(index);
            if(force){
                me.onSelect(me, rec);
            }
        }
    },
    updateStore: function(store, oldStore){
        this.callParent(arguments);
        var events = {
            scope: this,
            addrecords: 'onStoreDataChanged',
            removerecords: 'onStoreDataChanged',
            //updaterecord: 'onStoreDataChanged',
            refresh: 'onStoreDataChanged'
        };
        if(store){
            store.on(events);
        }
        if(oldStore){
            oldStore.un(events);
        }
    },
    onStoreDataChanged: function(){
        if(this.getScrollable()){
            if(this.isPainted()){
                this.refreshHeight();
            }
            else{
                this.on({
                    painted: 'refreshHeight',
                    single: true,
                    scope: this
                });
            }
        }
        this.updateValue(this.getValue());
    },
    initialize: function(){
        var me = this;
        me.callParent(arguments);

        me.addCls('line-tabbar');

        var store = me.getStore();
        if(store && store.getCount() > 0){
            if(!me.getSelection().length){
                me.select(0);
                me._value = store.getAt(0).get(me.getValueField());
            }
        }
        
        me.on({
            select: 'onSelect',
            scope: me
        });
        me.underLine = Ext.Element.create({ cls: 'underline' });
        me.referenceList.push('underLine');
        me.innerElement.appendChild(me.underLine);

        if(this.getScrollable()){
            me.on({
                painted: 'refreshHeight',
                scope: me,
                single: true
            });
        }
        me.on({
            painted: 'refreshUnderLine',
            scope: me,
            single: true
        });
        Ext.Viewport.on({ 
            orientationchange: 'refreshUnderLine',
            buffer: 50,
            scope: me
        });
        me.disableOverScroll(me, 'x');
        var scrollable = me.getScrollable();
        if(scrollable) {
            scrollable.getScroller().getContainer().on({
                swipe: 'onScrollSwipe',
                scope: me
            });
        }
    },
	disableOverScroll: function(container, axis){
		var scrollable = container.getScrollable();
		if(scrollable){
			var scroller = scrollable.getScroller();
			scroller.getMomentumEasing()[axis].getBounce().setAcceleration(0.0001);
			scroller.setOutOfBoundRestrictFactor(0);
		}
	},
    destroy: function(){
        this.callParent(arguments);
        Ext.Viewport.un({ 
            orientationchange: 'refreshUnderLine',
            scope: this
        });
    },
    onScrollSwipe: function(e){
        e.stopPropagation();
    },
    onSelect: function(me, record){
        var idx = me.getStore().indexOf(record),        
            oldValue = me.getValue();

        this._value = record.get(this.getValueField());
        var carousel = me.getCarousel();
        if(carousel) 
            carousel.setActiveItem(idx);

        if(this.isPainted()){
            me.refreshUnderLine();
        }
        else{
            this.on({
                painted: 'refreshUnderLine',
                single: true,
                scope: this
            });
        }

        if(oldValue != this._value){
            me.fireEvent('change', me, this._value, oldValue);
        }
    },
    refreshHeight: function(){
        //if(this.getScrollable()){
            var h = this.container.element.getHeight();
            if(h > 0){
                this.setHeight(h + 2);
            }
        //}
    },
    refreshUnderLine: function(){
        var me = this,
            item = me.innerElement.down('.x-item-selected');
        if(item) {
            var w = item.getWidth(),
                offset = item.getOffsetsTo(item.parent());
            this.underLine.setStyle({
                width: w + 'px'
            });
            this.underLine.translate(offset[0], 0);
            this.underLineX = offset[0];
            this.underLineWidth = w;

            this.scrollToIndex(item);
        }
    },
    scrollToIndex: function(item){
        var me = this,
            scrollable = me.getScrollable();
        if(scrollable) {
            var scroller = scrollable.getScroller(),
                containerSize = scroller.getContainerSize().x,
                size = scroller.getSize().x,
                maxOffset = size - containerSize,
                offset;
            
            offset = item.dom.offsetLeft;
            offset = Math.max(offset - parseInt((containerSize - item.getWidth()) / 2), 0);

            offset = Math.min(offset, maxOffset);
            scroller.scrollTo(offset, 0, true);
        }
    }
});