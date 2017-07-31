Ext.define('EQMS.view.lpa.LpaList', {
    extend: 'Ext.List',
    xtype: 'lpaList',
	alternateClassName: 'lpaList',
    requires: [
		'Ext.device.Camera',
		'EQMS.view.lpa.ItemList',
		"UX.TouchCalendarSimpleEvents",
		"UX.TouchCalendarView",
		"UX.TouchCalendar",
		'Ext.plugin.PullRefresh',
		'Ext.plugin.ListPaging'
    ],
    config: {
		title: Ext.Date.format(new Date(), "Y年n月"),
		cls: 'lpalist-view',
		orient: 'portrait',
		scrollable: {
            direction: 'vertical',
            directionLock: true,
            indicators: false //不显示滚动条
        },
		//视差滚动相关
        containerSlideDelay: 5,
        slideDuration: 250,
        items: [
            {
                xtype: 'component',
                docked : 'bottom',
                html: '<div class="prompt"><div class="prompt-cell"><a class="round2">●</a> 有审核任务</div><div class="prompt-cell"><a class="round3">●</a> 超时未审核</div><div class="prompt-cell"><a class="round6">●</a> 超时已审核</div><div class="prompt-cell"><a class="round5">●</a> 提前审核</div><div class="prompt-cell"><a class="round4">●</a> 正常审核</div></div>'
            },
			{
				xtype: 'component',
				cls: 'calendar-head',
				docked : 'top',
				itemId: 'calendarHead',
				tpl: [
					'<tpl for=".">',
						'<div>{[values]}</div>',
					'</tpl>'
				].join(''),
				data: ['一', '二','三','四','五','六','日'] //周一~周日
			}, {
				xtype: "calendar", //日历
				itemId: 'calendar',
                height: '50%',
				docked : 'top',
				viewMode: 'month',
				enableSimpleEvents: {
                    startEventField: 'StartDate',//事件数据中的开始时间和结束时间字段
                    endEventField: 'EndDate'
                },
                eventStore: { //当前月的所有事件
                    type: "store",
                    model: "EQMS.model.Calendar",
                    storeId: 'calendar',
                    autoDestroy: true
                }
			}
		],
		variableHeights: false,
		store: {
			type: 'lpaList',
			storeId: 'lpaList'
		},
		emptyText: '没有数据',
		itemTpl: Ext.create('Ext.XTemplate',
			 '<div class="flexbox box-align-center">',
				'<div class="avatar firstletter system" letter="{[this.isAudit(values.createDate)]}" style="{[values.createDate == null ? \'\' : \'background: #00AA00; color: blue;\']}"></div>',
				'<div class="flex10">',
					'<h3 class="flexbox">',
						'<div class="from flexbox box-align-center flex1 ellipsis">{field01}</div>',
						'<span class="date">{[Ext.Date.format(values.workDate, "Y-m-d")]}</span>',
					'</h3>',
					/*'<h4 class="ellipsis">{bomInfo20SubName}</h4>',*/
					'<h5 class="two-line-summary">{listName}</h5>',
				'</div>',
			'</div>',
			{
				isAudit: function(createDate){
					return createDate == null ? '未':'已'
				}
			}
		 )
    }

	/*,
	initialize: function () {
		var me = this;
		me.callParent(arguments);

		me.on({
			painted: 'onFirstPainted',
			single: true,
			scope: this
		});
		
        me.getCalendar().element.on({
            swipe: 'onCalendarSwipe',
            scope: me
        });

        var dragEl = me.getDragEl();
        dragEl.setStyle({
            zIndex: 3,
            backgroundColor: '#fff',
            boxShadow: '0 0 2px #aaa'
        });

        var draggable = new Ext.util.Draggable({
            element: dragEl,
            direction: "vertical",
            listeners: {
                dragstart: {
                    fn: 'onContainerDragstart',
                    order: "before",
                    scope: me
                },
                drag: 'onContainerDrag',
                dragend: 'onContainerDragend',
                scope: me
            }
        });
        me.draggable = draggable;
        draggable.getTranslatable().on({
        	animationframe: 'onDragAnimation',
            scope: me
        });

        dragEl.on({
        	drag: function(e) {
                var me = this,
                    scroller = me.getScrollable().getScroller(),
                	deltaX = e.absDeltaX, deltaY = e.absDeltaY;
                if (deltaX > 10 && !me.dragAllowed) {
                    me.dragAllowedForced = true;
                    return false;
                }
                var c = me.isCollapsed();
                if (deltaY > me.getContainerSlideDelay() && !me.dragAllowed && !me.dragAllowedForced && (!c  || (c && scroller.startPosition.y <= 0))) {
                    me.dragAllowed = true;
                    dragEl.fireEvent("dragstart", e);
                }
        	},
        	dragstart: function(e) {
                this.draggable.setConstraint(this.getDragConstraint());

                //求视差高度（日历顶部到日历当前行的高度）
                this.calcParallaxHeight();
    		},
        	dragend: function(e) {
                this.dragAllowedForced = false;
                this.dragAllowed = false;
        	},
        	scope: me
        });

        //往下drag的时候，禁用scroller
		var s = me.getScrollable().getScroller();
        s.getContainer().on({
            dragstart: function(e){
                if(!this.getDisabled()) {
                    if(e.absDeltaY > e.absDeltaX && e.deltaY > 0 && this.position.y == 0){
                        this.setDisabled(true);
                    }
                }
            },
            scope: s
        });
        s.setDisabled(true);
	},

    destroy: function(){
    	var me = this;
    	me.callParent(arguments);
    	
    	me.draggable.destroy();
    	delete me.draggable;
    	delete me._calendar;
    	delete me._calLineHeight;
    	delete me._parallaxHeight;
    },
    //求视差高度（日历顶部到日历当前行的高度）
    calcParallaxHeight: function(){
        var calView = this.getCalendar().getActiveItem(),
            dom = calView.element.dom,
            cell = dom.querySelector('td.time-block.selected');
        if(!cell) cell = dom.querySelector('td.time-block.today');
        if(cell){
            var idx = parseInt(cell.parentNode.getAttribute('rowidx'));
            this._parallaxHeight = idx * this._calLineHeight; 
        }
        else 
            this._parallaxHeight = 0;
    },
	onFirstPainted: function(){
		var size = this.element.getSize(),
			calLineHeight = Math.ceil((size.width - 8*2) / 7 + 8 + 8),
			height = size.height - this.down('component#calendarHead').element.getHeight() - calLineHeight;
		this._calLineHeight = calLineHeight; //日历一行的高度

		this.getDragEl().setStyle('min-height', height + 'px');

	},
    onCalendarSwipe: function(e){
        if(e.direction == "up"){
            if(!this.isCollapsed()){
                this.setCollapsed(true);
            }
        }
        else if(e.direction == "down"){
            if(this.isCollapsed()){
                this.setCollapsed(false);
            }
        }
    },
    getCalendar: function(){
    	if(!this._calendar) 
    		this._calendar = this.down('calendar');
        return this._calendar;
    },
    getDragEl: function(){
        return this.element.down('.x-dock-body');
    },
    getDragConstraint: function() {
        var calendar = this.getCalendar(), 
		
        constraint = {
            min: {
                x: 0,
                y: -(calendar.element.getHeight() - this._calLineHeight)
            },
            max: {
                x: 0,
                y: 0
            }
        };
        return constraint;
    },
    onContainerDragstart: function(draggable, e) {
        if (!this.dragAllowed) {
            return false;
        }
    },
    onContainerDrag: function(draggable, e){
    	var constraintY = draggable.getConstraint().min.y,
    		offsetY = draggable.offset.y,
    		t = offsetY * this._parallaxHeight / constraintY;
    	this.getCalendar().element.translate(0, -t);
    },
    onDragAnimation: function(t, x, y){
    	var constraintY = this.draggable.getConstraint().min.y,
    		t = y * this._parallaxHeight / constraintY;
    	this.getCalendar().element.translate(0, -t);
    },
    onContainerDragend: function(draggable, e) {
        var velocity = Math.abs(e.flick.velocity.y), 
            direction = e.deltaY > 0 ? "down" : "up", 
            offsetY = Math.abs(draggable.offset.y), 
            calendar = this.getCalendar(), 
            threshold = 0, height = 0;

        if (offsetY > 0) {
            height = -draggable.getConstraint().min.y;
            threshold = parseInt(height * .5);

            switch (direction) {
                case "up":
                    offsetY = (velocity > .5 || offsetY > threshold) ? -height : 0;
                    break;

                case "down":
                    offsetY = (velocity > .5 || offsetY < threshold) ? 0 : -height;
                    break;
            }
        }
        this.moveContainer(offsetY);
    },
    moveContainer: function(offsetY, duration) {
        var duration = duration === undefined ? this.getSlideDuration() : duration;

        this.element[offsetY == 0 ? 'removeCls' : 'addCls']("collapsed");
        this.getScrollable().getScroller().setDisabled(offsetY == 0);

        this.draggable.setOffset(0, offsetY, {
            duration: duration,
            easing: "ease-out"
        });
    },
    setCollapsed: function(f){
        if(f){
            this.draggable.setConstraint(this.getDragConstraint());

            this.calcParallaxHeight();
            this.moveContainer(this.draggable.getConstraint().min.y);
        }
        else{
            this.moveContainer(0);
        }
    },
    isCollapsed: function(){
        return this.element.hasCls("collapsed");
    }*/
});
