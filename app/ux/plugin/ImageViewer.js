/*
 * UX.ImageViewer
 *
 * 用法：
 * Ext.Viewport.add({
       xtype: "imgviewer",
       src: 图片URL 或者 本地图片fileURL
   });
 */
Ext.define('UX.plugin.ImageViewer', {
    extend: 'Ext.Sheet',
    alias : 'widget.imgviewer',
    
    config: {
        doubleTapScale: 1,
        maxScale      : 4,
        previewSrc    : false,
        resizeOnLoad  : true,
        src      : false,
        initOnActivate: false,
        
        hideOnTap: true,
        destroyOnHide: true,

        modal: true,
        centered: true,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        //showAnimation: false,
        //hideAnimation: false,
        stretchX: true,
        stretchY: true,
        cls: 'imgviewer',
        style: 'background-color:#fff',
        scrollable    : 'both',
        html          : [
            '<div class="radial-progress x-hidden">',
                '<div class="mask full">',
                  '<div class="fill"></div>',
                '</div>',
                '<div class="mask half">',
                  '<div class="fill"></div>',
                '</div>',
            '</div>',
            '<div class="tip-wrapper flexbox box-align-center box-pack-center">',
                '<div class="tip x-hidden"></div>',
            '</div>',
            '<figure>',
                '<img>',
            '</figure>',
            '<div class="down" style="display:none"></div>'
        ].join('')
    },
    
    duringDestroy: false,

    initialize: function() {
        var me = this;
        
        me.on(me.getInitOnActivate() ? 'activate' : 'painted', me.initViewer, me, {
            delay: 10, 
            single: true
        });
        me.element.on({
            tap: 'tapImg',
            scope: me
        });
    },
    tapImg: function(e, target){
        if(Ext.fly(target).hasCls('down')) {
            //保存图片
            var src = this.imgEl.dom.src;
            if(!Ext.isEmpty(src) && window.plugins && plugins.saveToPhotoAlbum) {
                plugins.saveToPhotoAlbum.save(function(){
                    alert('成功保存到相册');
                },function(msg){
                    alert('保存失败: ' + msg);
                }, src);
            }
        }
        else if(this.getHideOnTap()) {
            this.hide();
        }
    },
    hide: function() {
        this.callParent(arguments);
        if(this.getDestroyOnHide()) {
            this.destroy();
        }
    },

    initViewer: function() {
        var me = this,
            scroller = me.getScrollable().getScroller(),
            element = me.element;

        //disable scroller
        scroller.setDisabled(true);

        // retrieve DOM els
        me.figEl = element.down('figure');
        me.imgEl = me.figEl.down('img');

        // apply required styles
        me.figEl.setStyle({
            overflow : 'hidden',
            display : 'block',
            margin : 0
        });

        me.imgEl.setStyle({
            '-webkit-user-drag' : 'none',
            'visibility' : 'hidden'
        });
        me.setOrigin(0, 0);

        // show preview
        if (me.getPreviewSrc()) {
            element.setStyle({
                backgroundImage : 'url(' + me.getPreviewSrc() + ')',
                backgroundPosition : 'center center',
                backgroundRepeat : 'no-repeat',
                backgroundSize : 'contain',
                webkitBackgroundSize : 'contain'
            });
        }

        me.imgEl.on({
            scope : me,
            doubletap : me.onDoubleTap,
            pinchstart : me.onImagePinchStart,
            pinch : me.onImagePinch,
            pinchend : me.onImagePinchEnd
        });

        // load image
        if (me.getSrc()) {
            me.loadImage(me.getSrc());
        }
    },

    loadImage: function(src) {
        var me = this;
        if (me.imgEl) {
            var down = me.element.down('.down'),
                pb = me.element.down('.radial-progress'),
                tip = me.element.down('.tip'),
                pb1 = pb.down('div.mask.full'),
                pb2 = pb.select('div.fill');
            tip.addCls('x-hidden');
            down.hide();

            me.getImage(src);
        }
        else {
            me.setSrc(src);
        }
    },

    //读取image file
    loadImageFile: function (imgFile, maxHeight, callback, scope){ 
        if(!imgFile.type.match(/image.+/)){
            alert("只能选择图片文件"); 
            return;
        }
        var reader = new FileReader();  
        reader.onload = function(e){
            if(maxHeight > 0) { //缩放
                var image = new Image();
                image.onload = function(){  
                    var canvas = document.createElement("canvas");
                    if(image.height > maxHeight) {  
                        image.width *= maxHeight / image.height;
                        image.height = maxHeight;
                    }
                    var ctx = canvas.getContext("2d");  
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    canvas.width = image.width;  
                    canvas.height = image.height;
                    ctx.drawImage(image, 0, 0, image.width, image.height);
                    callback.call(scope, canvas.toDataURL('image/jpeg', 0.3));
                };
                image.src = e.target.result;  
            }
            else
                callback.call(scope, e.target.result);
        };
        reader.readAsDataURL(imgFile);
    },

    getImage: function(src) {
        var cb = function(data){
            var imgDom = this.imgEl.dom;
            imgDom.src = data;
            imgDom.onload = Ext.Function.bind(this.onImageLoad, this);
            imgDom.onerror = Ext.Function.bind(this.onImageError, this);
        };
        if(src instanceof File) {
            this.loadImageFile(src, -1, cb, this);
        }
        else {
            cb.call(this, src);
        }
    },
    
    unloadImage: function() {  
        var me = this;
    
        if (me.imgEl) {
            me.imgEl.dom.src = '';
            me.imgEl.setStyle({ visibility: 'hidden' });
        } else {
            me.setSrc('');
            me.imgEl.setStyle({ visibility: 'hidden' });
        }
    },

    onImageLoad : function() {
        var me = this;
        if(!me.parent) return;
        var parentElement = me.parent.element;

        // get viewport size
        me.viewportWidth = me.viewportWidth || me.getWidth() || parentElement.getWidth();
        me.viewportHeight = me.viewportHeight || me.getHeight() || parentElement.getHeight();

        // grab image size
        me.imgWidth = me.imgEl.dom.width;
        me.imgHeight = me.imgEl.dom.height;

        // calculate and apply initial scale to fit image to screen
        if (me.getResizeOnLoad()) {
            me.scale = me.baseScale = Math.min(me.viewportWidth / me.imgWidth, me.viewportHeight / me.imgHeight);
            me.setMaxScale(me.scale * 4);
        } else {
            me.scale = me.baseScale = 1;
        }

        // calc initial translation
        var tmpTranslateX = (me.viewportWidth - me.baseScale * me.imgWidth) / 2,
            tmpTranslateY = (me.viewportHeight - me.baseScale * me.imgHeight) / 2;
        
        // set initial translation to center
        me.setTranslation(tmpTranslateX, tmpTranslateY);
        me.translateBaseX = me.translateX;
        me.translateBaseY = me.translateY;

        // apply initial scale and translation
        me.applyTransform();

        // initialize scroller configuration
        me.adjustScroller();

        // show image and remove mask
        me.imgEl.setStyle({
            visibility : 'visible'
        });

        // remove preview
        if (me.getPreviewSrc()) {
            me.element.setStyle({
                backgroundImage : 'none'
            });
        }

        me.fireEvent('imageLoaded', me);

        if(Ext.browser.is.phonegap)
            me.element.down('.down').show();

        me.getScrollable().getScroller().refresh();
    },

    onImageError:function() {
        var tip = this.element.down('.tip');
        tip.removeCls('x-hidden');
        tip.setHtml('出错了');
    },

    onImagePinchStart: function(ev) {
        var me = this,
            scroller = me.getScrollable().getScroller(),
            scrollPosition = scroller.position,
            touches = ev.touches,
            element = me.element,
            scale = me.scale;

        // disable scrolling during pinch
        scroller.stopAnimation();
        scroller.setDisabled(true);

        // store beginning scale
        me.startScale = scale;

        // calculate touch midpoint relative to image viewport
        me.originViewportX = (touches[0].pageX + touches[1].pageX) / 2 - element.getX();
        me.originViewportY = (touches[0].pageY + touches[1].pageY) / 2 - element.getY();

        // translate viewport origin to position on scaled image
        me.originScaledImgX = me.originViewportX + scrollPosition.x - me.translateX;
        me.originScaledImgY = me.originViewportY + scrollPosition.y - me.translateY;

        // unscale to find origin on full size image
        me.originFullImgX = me.originScaledImgX / scale;
        me.originFullImgY = me.originScaledImgY / scale;

        // calculate translation needed to counteract new origin and keep image in same position on screen
        me.translateX += (-1 * ((me.imgWidth * (1 - scale)) * (me.originFullImgX / me.imgWidth)));
        me.translateY += (-1 * ((me.imgHeight * (1 - scale)) * (me.originFullImgY / me.imgHeight)));

        // apply new origin
        me.setOrigin(me.originFullImgX, me.originFullImgY);

        // apply translate and scale CSS
        me.applyTransform();
    },

    onImagePinch: function(ev) {
        var me = this;
        
        // prevent scaling to smaller than screen size
        me.scale = Ext.Number.constrain(ev.scale * me.startScale, me.baseScale - 2, me.getMaxScale());
        me.applyTransform();
    },

    onImagePinchEnd : function(ev) {
        var me = this;

        // set new translation
        if (me.scale == me.baseScale) {
            // move to center
            me.setTranslation(me.translateBaseX, me.translateBaseY);
        } else {
            //Resize to init size like ios
            if (me.scale < me.baseScale && me.getResizeOnLoad()) {
                me.resetZoom();
                return;
            }
            // calculate rescaled origin
            me.originReScaledImgX = me.originScaledImgX * (me.scale / me.startScale);
            me.originReScaledImgY = me.originScaledImgY * (me.scale / me.startScale);

            // maintain zoom position
            me.setTranslation(me.originViewportX - me.originReScaledImgX, me.originViewportY - me.originReScaledImgY);
        }
        // reset origin and update transform with new translation
        me.setOrigin(0, 0);
        me.applyTransform();

        // adjust scroll container
        me.adjustScroller();
    },

    onZoomIn: function() {
        var me = this,
            ev = {
                pageX: 0,
                pageY: 0
            },
            myScale = me.scale;
            
        if (myScale < me.getMaxScale()) {
            myScale = me.scale + 0.05;
        }
        
        if (myScale >= me.getMaxScale()) {
            myScale = me.getMaxScale();
        }

        ev.pageX = me.viewportWidth / 2;
        ev.pageY = me.viewportHeight / 2;
        
        me.zoomImage(ev, myScale);
    },

    onZoomOut: function() {
        var me = this,
            ev = {
                pageX: 0,
                pageY: 0
            },
            myScale = me.scale;
            
        if (myScale > me.baseScale) {
            myScale = me.scale - 0.05;
        }
        
        if (myScale <= me.baseScale) {
            myScale = me.baseScale;
        }

        ev.pageX = me.viewportWidth / 2;
        ev.pageY = me.viewportHeight / 2;
        
        me.zoomImage(ev, myScale);
    },

    zoomImage: function(ev, scale, scope) {
        var me = this,
            scroller = me.getScrollable().getScroller(),
            scrollPosition = scroller.position,
            element = me.element;

        // zoom in toward tap position
        var oldScale = me.scale,
            newScale = scale,
            originViewportX = ev ? (ev.pageX - element.getX()) : 0,
            originViewportY = ev ? (ev.pageY - element.getY()) : 0,
            originScaledImgX = originViewportX + scrollPosition.x - me.translateX,
            originScaledImgY = originViewportY + scrollPosition.y - me.translateY,
            originReScaledImgX = originScaledImgX * (newScale / oldScale),
            originReScaledImgY = originScaledImgY * (newScale / oldScale);

        me.scale = newScale;
        setTimeout(function() {
            me.setTranslation(originViewportX - originReScaledImgX, originViewportY - originReScaledImgY);
            // reset origin and update transform with new translation
            //that.setOrigin(0, 0);

            // reset origin and update transform with new translation
            me.applyTransform();

            // adjust scroll container
            me.adjustScroller();

            // force repaint to solve occasional iOS rendering delay
            Ext.repaint();
        }, 50);
    },

    onDoubleTap: function(ev, t) {
        var me = this,
            scroller = me.getScrollable().getScroller(),
            scrollPosition = scroller.position,
            element = me.element;

        if (!me.getDoubleTapScale()){
            return false;
        }

        // set scale and translation
        if (me.scale > me.baseScale) {
            // zoom out to base view
            me.scale = me.baseScale;
            me.setTranslation(me.translateBaseX, me.translateBaseY);
            // reset origin and update transform with new translation
            me.applyTransform();

            // adjust scroll container
            me.adjustScroller();

            // force repaint to solve occasional iOS rendering delay
            Ext.repaint();
        } else {
            // zoom in toward tap position
            var oldScale = me.scale,
                newScale = me.baseScale * 4,

                originViewportX = ev ? (ev.pageX - element.getX()) : 0,
                originViewportY = ev ? (ev.pageY - element.getY()) : 0,

                originScaledImgX = originViewportX + scrollPosition.x - me.translateX,
                originScaledImgY = originViewportY + scrollPosition.y - me.translateY,

                originReScaledImgX = originScaledImgX * (newScale / oldScale),
                originReScaledImgY = originScaledImgY * (newScale / oldScale);

            me.scale = newScale;

            //smoothes the transition
            setTimeout(function() {
                me.setTranslation(originViewportX - originReScaledImgX, originViewportY - originReScaledImgY);
                // reset origin and update transform with new translation
                me.applyTransform();

                // adjust scroll container
                me.adjustScroller();

                // force repaint to solve occasional iOS rendering delay
                Ext.repaint();
            }, 50);
        }
    },

    onMaskTap:function () {
        var me = this;
        me.hide();
    },

    setOrigin: function(x, y) {
        var dom = this.imgEl.dom,
            s = x + 'px ' + y + 'px';
        dom.style.webkitTransformOrigin = s;
        dom.style.transformOrigin = s;
    },

    setTranslation: function(translateX, translateY) {
        var me = this;
        
        me.translateX = translateX;
        me.translateY = translateY;

        // transfer negative translations to scroll offset
        me.scrollX = me.scrollY = 0;

        if (me.translateX < 0) {
            me.scrollX = me.translateX;
            me.translateX = 0;
        }
        if (me.translateY < 0) {
            me.scrollY = me.translateY;
            me.translateY = 0;
        }
    },

    resetZoom: function() {
        var me = this;
        
        if (me.duringDestroy) {
            return;
        }
        
        //Resize to init size like ios
        me.scale = me.baseScale;

        me.setTranslation(me.translateBaseX, me.translateBaseY);

        // reset origin and update transform with new translation
        me.setOrigin(0, 0);
        me.applyTransform();

        // adjust scroll container
        me.adjustScroller();

    },
    
    resize: function() {
        var me = this;
        
        // get viewport size
        me.viewportWidth = me.parent.element.getWidth() || me.viewportWidth || me.getWidth();
        me.viewportHeight = me.parent.element.getHeight() || me.viewportHeight || me.getHeight();

        // grab image size
        me.imgWidth = me.imgEl.dom.width;
        me.imgHeight = me.imgEl.dom.height;

        // calculate and apply initial scale to fit image to screen
        if (me.getResizeOnLoad()) {
            me.scale = me.baseScale = Math.min(me.viewportWidth / me.imgWidth, me.viewportHeight / me.imgHeight);
            me.setMaxScale(me.scale * 4);
        } else {
            me.scale = me.baseScale = 1;
        }

        // set initial translation to center
        me.translateX = me.translateBaseX = (me.viewportWidth - me.baseScale * me.imgWidth) / 2;
        me.translateY = me.translateBaseY = (me.viewportHeight - me.baseScale * me.imgHeight) / 2;

        // apply initial scale and translation
        me.applyTransform();

        // initialize scroller configuration
        me.adjustScroller();
    },

    applyTransform: function() {
        var me = this,
            dom = me.imgEl.dom,
            fixedX = Ext.Number.toFixed(me.translateX, 5),
            fixedY = Ext.Number.toFixed(me.translateY, 5),
            fixedScale = Ext.Number.toFixed(me.scale, 8),
            s;
        if (Ext.os.is.Android) {
            s = 'matrix(' + fixedScale + ',0,0,' + fixedScale + ',' + fixedX + ',' + fixedY + ')';
        } else {
            s = 'translate3d(' + fixedX + 'px, ' + fixedY + 'px, 0)' + ' scale3d(' + fixedScale + ',' + fixedScale + ',1)';
        }
        dom.style.webkitTransform = s;
        dom.style.transform = s;
    },

    adjustScroller: function() {
        var me = this,
            scroller = me.getScrollable().getScroller(),
            scale = me.scale;

        // disable scrolling if zoomed out completely, else enable it
        if (scale == me.baseScale) {
            scroller.setDisabled(true);
        } else {
            scroller.setDisabled(false);
        }

        // size container to final image size
        var boundWidth = Math.max(me.imgWidth * scale + 2 * me.translateX, me.viewportWidth);
        var boundHeight = Math.max(me.imgHeight * scale + 2 * me.translateY, me.viewportHeight);

        me.figEl.setStyle({
            width : boundWidth + 'px',
            height: boundHeight + 'px'
        });

        // update scroller to new content size
        scroller.refresh();

        // apply scroll
        var x = 0;
        if (me.scrollX) {
            x = me.scrollX;
        }
        
        var y = 0;
        if (me.scrollY) {
            y = me.scrollY;
        }
        
        scroller.scrollTo(x * -1, y * -1);
    },
    
    destroy: function() {
        var me = this;
        
        me.duringDestroy = true;
        
        me.un({
            activate: 'initViewer',
            painted: 'initViewer',
            scope: me
        });
        
        me.callParent();
    }
}); 
