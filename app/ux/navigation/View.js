/*
    扩展的NavigationView导航容器控件 by 神秘博士
    
    一、NavigationView导航容器, 
    1、具有下面的config：
        1) swipeback: 类型int，滑动手势返回，小于等于0表示不支持，大于0表示距离左边缘多少像素开始按住可以滑动
        注：滑动返回，意思是手指从左边缘向右滑动，可以返回
        2) cacheNum：类型int，视图缓存机制，表示NavigationView最多可以缓存的视图个数，
        注：当autoDestroy为false(不自动销毁子视图)的时候，适当设置这个数字，可以提高性能
    ————————————————————————————————————————————————————————————————————————————————————————————————————————————

    二、navigationView中的每个子视图view, 
    1、都可以配置下面的config:
        1) navBtns: 类型array, 表示这个view需要在顶栏显示什么按钮
        2) backBtnConfig: 类型object, 表示这个view的返回按钮显示成什么样子
        3) orient: 'portrait-primary'、'portrait-secondary'、'portrait'、'landscape-primary'、'landscape-secondary'、'landscape'. 屏幕方向
        4) canSwipeback: 类型boolean, 表示可不可以滑动返回

    2、事件：
        1) pushview: 参数view。子视图push之后会触发的事件
        2) popview: 参数view。子视图pop之后会触发的事件
           注：pushview和popview，都是单向的
        3) activateview: 参数newView, oldView。切换到（或者激活）子视图newView会触发到的事件(类似windows某个窗口获得焦点)
        4) deactivateview: 参数oldView, newView。切换到了其他视图newView，原来的子视图oldView失去焦点会触发到的事件(类似windows某个窗口失去焦点)
           注：activateview和deactivateview，都是双向的（也就是push这个动作会一起触发这两个事件，pop这个动作也是）

    3、还有方法：
        1) tapBackBtn: 点击返回按钮要做的事情, return false则接管默认的返回行为
        2) beforePop: pop之前会调用的, return false则不会继续do pop view
*/
Ext.define('UX.navigation.View', {
    extend: 'Ext.navigation.View',
    xtype: 'uxnavigationview',

    config: {

        //自定义配置项
        swipeback: 40, //小于等于0表示不支持，大于0表示距离左边缘多少像素开始按住可以滑动。默认40像素
        cacheNum: 5 //最多可以缓存的视图个数。默认5
    },

    initialize: function() {
        var me = this;
        me.callParent(arguments);

        me.onBefore('activeitemchange', 'beforeActiveItemChange', me);
        me.on({
            activeitemchange: 'onActiveItemChange',
            pop: 'onSelfPop',
            push: 'onSelfPush',
            scope: me
        });
        me.onAfter('activeitemchange', 'afterActiveItemChange', me);

        var navBar = me.getNavigationBar();
        Ext.Function.interceptAfter(navBar, "doChangeView", me.doChangeView, me);
    },
    
    destroy: function() {
        var me = this;
        me.unAfter('activeitemchange', 'afterActiveItemChange', me);
        me.un({
            activeitemchange: 'onActiveItemChange',
            pop: 'onPop',
            push: 'onPush',
            scope: me
        });
        me.unBefore('activeitemchange', 'beforeActiveItemChange', me);

        me.callParent(arguments);
    },
    onActiveItemChange: function(me, view, oldView) {//在各自的View里面触发
        me._toggleViewNavBtn(view);//切换按钮显示
        me._toggleOrient(view);//屏幕方向

        if (oldView) oldView.fireEvent('deactivateview', oldView, view);
        if (view) view.fireEvent('activateview', view, oldView);
    },
    onSelfPush: function(me, view, e){
        view.fireEvent('pushview', view);

        //视图缓存机制
        if(!this.getAutoDestroy()) {
            if (!view.isXType('loadmask')) {
                this.noCacheLatelyUsed(view); //cache中最近使用到的view，就不被cache
            }
        }
    },
    onSelfPop: function(me, view, e){
        view.fireEvent('popview', view);

        //视图缓存机制
        if(!this.getAutoDestroy()) {
            if (!view.isXType('loadmask')) {
                this.addToCache(view); 
                this.destorySeldomUsed(); //cache中长时间未使用到的view，就destroy
            }
        }
    },


    /*在你自己的css文件里面加上下面的css类，可以缓解点击穿透的现象
    点击穿透，参看：http://blog.csdn.net/lovelyelfpop/article/details/28855051

    .x-container.prevent-pointer-events  {
        input, textarea, a {
            pointer-events: none;
        }
    }*/
    beforeActiveItemChange: function(container, newItem, oldItem) {
        if (newItem.element)
            newItem.element.addCls('prevent-pointer-events');
    },
    afterActiveItemChange: function(container, newItem, oldItem) {
        setTimeout(function() {
            if (newItem.element)
                newItem.element.removeCls('prevent-pointer-events');
        }, 300);
    },

    /*
        根据子视图的设置 动态改变返回按钮的样式
    */
    doChangeView: function(view, hasPrevious, reverse){
        var active = view.getActiveItem();
        if (active) {
            var bar = view.getNavigationBar(),
                backButtonText = bar.getBackButtonText(),
                backBtn = bar.getBackButton(),
                backConfig;

            if( active.getBackBtnConfig && !!(backConfig = active.getBackBtnConfig()) ){
                backBtn.setUi('normal');
                backBtn.setText(backConfig.text || backButtonText);
                backBtn.setIconCls(backConfig.iconCls || null);
                backBtn.setHidden(backConfig.hidden || null);
            }
            else{
                backBtn.setUi('back');
                backBtn.setText(backButtonText);
                backBtn.setIconCls(null);
            }
        }
    },


    onBackButtonTap: function(){
        var active = this.getActiveItem();
        if(active.getItemId().indexOf("itemList") != -1){
            var _createDate = active.getLpaListRecord().get('createDate');
            if(!_createDate){
                Ext.Msg.confirm( '提示', '数据没有提交，是否确认返回？', function(buttonId, value ,opt){
                if(buttonId == 'yes'){
                    if(!active || !active.tapBackBtn || active.tapBackBtn()){
                        Ext.Viewport.getActiveItem().pop();
                        }
                    }
                });
            }else{
                    if(!active || !active.tapBackBtn || active.tapBackBtn()){
                       Ext.Viewport.getActiveItem().pop();
                    }
            }
        }else{
                    if(!active || !active.tapBackBtn || active.tapBackBtn()){
                      Ext.Viewport.getActiveItem().pop();
                    }
        }
    },
    pop: function(count) {
        var innerItems = this.getInnerItems(),
            view = innerItems[innerItems.length - 1];
        if (!view.beforePop || view.beforePop()) {
            this.callParent(arguments);
        }
    },

    /*
        push一个view进来了的时候，添加可拖拽支持
    */
    onItemAdd: function(item, index) {
        var me = this;
        me.callParent(arguments);
        if (item && item.isInnerItem() && me.innerItems.length > 0) {
            if(me.innerItems.length == 1){
                me._toggleViewNavBtn(item);//切换按钮显示
                me._toggleOrient(item);//屏幕方向
            }
            else {
                var can = me.getSwipeback() > 0;
                if(item.getCanSwipeback)
                    can = can && item.getCanSwipeback();
                if(can && !item.getDraggable()) {
                    me.setDragInteraction(item);
                }
                if(!can && item.getDraggable()){
                    item.setDraggable(null);
                }
            }
        }
    },
    setDragInteraction: function(component) {
        var me = this,
            dragObj = {
            direction: 'horizontal',
            directionLock: true, 
            constraint: {
                min: {x: 0, y: 0},
                // allows us to drag the entire width of the view
                max: {x: window.innerWidth, y: 0}
            },
            listeners: {
                dragend: function(draggable, e) {
                    // if the user has dragged more than half the width of the 
                    // screen, set the offset to width of the screen and hide the view.
                    // console.log(e.flick.velocity);
                    if(draggable.offset.x > window.innerWidth / 2 || e.flick.velocity.x >= 1) {

                        // setOffset takes X, Y, and an animation object
                        draggable.setOffset(window.innerWidth, 0, {
                            type: 'slide',
                            duration: 200
                        });
                    }

                    // User didn't drag far enough so snap back.
                    else {
                        draggable.setOffset(0, 0, {
                            type: 'slide',
                            duration: 200
                        });
                    }
                },
                // Extra credit: set the size of the shadow to decrease when the user
                // drags closer to the right.
                drag: function(drag, e) {

                },
                dragstart: function(drag, e) {

                    if (e.startX > me.getSwipeback()){
                        this.isDragging = false;
                        return false;
                    }

                    this.isDragging = true;
                    var item = me.getPreviousItem();
                    if(item) {
                        item.element.dom.style.removeProperty("display");
                    }
                }
            }
        };
        component.setDraggable(dragObj);

        component.on('painted', function() {
            component.draggableBehavior.draggable.getTranslatable().on({
                animationend: function(translatable, b, c) {
                    var draggable = component.draggableBehavior.draggable, 
                        offset = draggable.getElement().getOffsetsTo(component.element.parent());

                    if (offset[0] == 0) {
                        var item = me.getPreviousItem();
                        if(item) {
                            item.element.dom.style.setProperty("display", 'none');
                        }
                    } else {
                        var layout = me.getLayout(),
                            anim = layout.getAnimation();
                        layout.setAnimation(false);
                        me.pop();
                        if(anim && !anim.isDestroyed)
                            layout.setAnimation(anim);

                        draggable.setOffset(0, 0);
                    }
                },
                scope: me
            });
        }, me, { single: true });
    },


    _btnInActions: function(btn, actions){
        var cur = btn.config.action;
        if(Ext.isEmpty(cur)) return false;
        var found = false, act;
        for(var i=0;i<actions.length;i++) {
            act = actions[i];
            if((Ext.isString(act) && act == cur) || (Ext.isObject(act) && act.action &&  act.action == cur)) {
                found = true;
                break;
            }
        }
        return found;
    },

    /*设置某个容器内按钮的显示与否
    container: 容器
    action: 一个或多个按钮的action，如'add'或者['add', 'refresh']
    attr: 'disabled'、'hidden'
    state: true、false
    */
    _setBtnsState: function(container, action, attr, state){
        var name = 'set' + attr.charAt(0).toUpperCase() + attr.substr(1),
            actions = Ext.isArray(action) ? action : (!!action ? [action] : []);
        Ext.each(actions, function(act, i) {
            var btn = Ext.isString(act) ? container.down('button[action=' + act + ']') : act;
            if(btn){
                btn[name](state);
            }
        });
    },
    setBtnsDisabled: function(container, action, disabled){
        this._setBtnsState(container, action, 'disabled', disabled);
    },
    setBtnsHidden: function(container, action, hidden){
        this._setBtnsState(container, action, 'hidden', hidden);
    },
    /*设置某个子视图的导航栏按钮的显示与否
    view: 要控制的子视图
    action 一个或多个按钮的action，如'add'或者['add', 'refresh']
    attr: 'disabled'、'hidden'
    state: true、false
    */
    _setNavBtnsState: function(view, action, attr, state){
        var active = this.getActiveItem();
        if(view === active) {
            var navBar = this.getNavigationBar();
            this._setBtnsState(navBar, action, attr, state);
        }
        if(view.getNavBtns){
            var states = view.navBtnStates || {},
                actions = Ext.isArray(action) ? action : (!!action ? [action] : []);
            Ext.each(actions, function(act, i) {
                if(!states.hasOwnProperty(act)) states[act] = {};
                states[act][attr] = state;
            });
            view.navBtnStates = states;
        }
    },
    setNavBtnsDisabled: function(view, action, disabled){
        this._setNavBtnsState(view, action, 'disabled', disabled);
    },
    setNavBtnsHidden: function(view, action, hidden){
        this._setNavBtnsState(view, action, 'hidden', hidden);
    },

    _toggleViewNavBtn: function(view){
        if(!view) return;
        var me = this,
            action = null;
        /*
            如果是子视图是card layout（卡片视图），我们可能在每个卡片切换的时候，
            同样要控制顶栏的按钮，所以就有了下面的判断
        */
        if(view.getLayout().isCard){
            var active = view.getActiveItem();
            if(active){
                if(active.getNavBtns)
                    action = active.getNavBtns();
                else if(active.config.navBtns)
                    action = active.config.navBtns;
                else {
                    if(view.getNavBtns)
                        action = view.getNavBtns();
                    else if(view.config.navBtns)
                        action = view.config.navBtns;
                } 
            }
        }
        else {
            if(view.getNavBtns)
                action = view.getNavBtns();
            else if(view.config.navBtns)
                action = view.config.navBtns;
        }

        var navBar = this.getNavigationBar(),
            backBtn = navBar.getBackButton(),
            actions = Ext.isArray(action) ? action : (!!action ? [action] : []);
        Ext.each(navBar.query('button'), function(btn) { //隐藏其他按钮
            if (btn !== backBtn && !this._btnInActions(btn, actions))
                btn.hide();
        }, this);
        if(actions.length == 0) return;
        var states = view.navBtnStates || {},
            btnsL = [], btnsR = [];
        Ext.each(actions, function(act, i) {
            act = Ext.isString(act) ? { action: act, iconCls: act } : act;
            var a = act.action,
                btn = navBar.down('button[action=' + a + ']');
            if(btn){
                if(act.hasOwnProperty('text'))
                    btn.setText(act.text);
                if(act.hasOwnProperty('iconCls'))
                    btn.setIconCls(act.iconCls);
            }
            if (!btn) { //按钮不存 就创建
                btn = Ext.factory(Ext.applyIf(act, {
                    xtype: 'button',
                    align: 'right'
                }));
				btn.on({
					tap: function() {
                        var view = me.getActiveItem();
                        view.fireEvent("tap" + a, view, this);
                    }
				});
                navBar.add(btn);
            }
            if (btn) {
                var align = btn.config.align;
                if(align == 'right') {
                    btnsR.push(btn);
                    if (btnsR.length > 1) {
                        var prev = btnsR[btnsR.length - 2];
                        btn.element.insertAfter(prev.element);
                    }
                }
                else if(align == 'left') {
                    btnsL.push(btn);
                    if (btnsL.length > 1) {
                        var prev = btnsL[btnsL.length - 2];
                        btn.element.insertAfter(prev.element);
                    }
                    else {
                        btn.element.insertAfter(backBtn.element);
                    }
                }
                var state = states[a] || {};
                btn.setDisabled(!state.hasOwnProperty('disabled') ? false : state.disabled);
                btn.setHidden(!state.hasOwnProperty('hidden') ? false : state.hidden);
            }
        });
    },
    _toggleOrient: function(view){
        if(!view || !window.plugins || !plugins.screenorientation) return;
        var orient = null;

        /*
            如果是子视图是card layout（卡片视图），我们可能在每个卡片切换的时候，
            同样要控制子视图的屏幕方向，所以就有了下面的判断
        */
        if(view.getLayout().isCard){
            var active = view.getActiveItem();
            if(active){
                if(active.getOrient)
                    orient = active.getOrient();
                else if(active.config.orient)
                    orient = active.config.orient;
                else {
                    if(view.getOrient)
                        orient = view.getOrient();
                    else if(view.config.orient)
                        orient = view.config.orient;
                } 
            }
        }
        else {
            if(view.getOrient)
                orient = view.getOrient();
            else if(view.config.orient)
                orient = view.config.orient;
        }
        if(orient){
            screen.lockOrientation(orient);//锁定屏幕方向
        }
        else{
            screen.unlockOrientation();
        }
    },

    /*
        子视图缓存机制
    */
    cache: [],
    updateCacheNum: function(newValue, oldValue) {
        this.destorySeldomUsed();
    },
    isInCache: function(view) {//判断某个view是不是在缓存里
        var id = view.isComponent ? view.id : view;
        return this.cache.indexOf(id) != -1;
    },
    addToCache: function(view) { //添加到cache里
        if (view.isComponent && view.isDestroyed) return;
        var id = view.isComponent ? view.id : view;
        var idx = this.cache.indexOf(id);
        if (idx == -1) this.cache.push(id);
    },
    noCacheLatelyUsed: function(view) { //cache中最近使用到的view，就从cache移除掉
        var id = view.isComponent ? view.id : view;
        var idx = this.cache.indexOf(id);
        if (idx >= 0) this.cache.splice(idx, 1);
    },
    destorySeldomUsed: function() { //cache中长时间未使用到的view，就从cache中取出destroy
        while (this.cache.length > this.getCacheNum()) {
            var id = this.cache.shift(), cmp = Ext.getCmp(id);
            if (cmp) cmp.destroy();
        }
    }
});