/*
* @file PC端轮播组件
* @import jquery.js
*
* @author huzhongchun
* @date 2015/05/08
*
*/
(function(window, undefined) {
    /*
    *
    *@export jQuery.easing.js
    *
     * - ''imgInit'' {Number}: (可选, 默认:2)初始加载几张图片
     * - ''autoPlay'' {Boolean}: ((可选, 默认:true)是否自动播放
     * - ''switchTime'' {Number} :((可选,默认:3000ms)自动播放的切换时间
     * - ''animateTime'' {Number} :((可选,默认:400ms)切换动画时间
     * - ''showDot'' {Boolean}: (可选, 默认:true)是否展示页码
     * - ''slideEnd'' {Function}: (可选)页面切换完成(滑动完成)时执行的函数,参数为滑动后的page页码
     * - ''dotsClass'' {string}:((可选,默认slider-dots)dot外容器的className
     * - ''dotsSelectedId'' {string}:((可选,默认slider-dot-select)选中了的dot的id
     * - ''direction'' {string}:((可选,默认1)自动滑动的方向（1和-1可选）
     */
    var Slider = function(id, opt) {
        var self = this;
        opt = opt || {};
        self.data = {
            dom: $('#'+id.replace(/^#/, '')),
            index: opt.index || 0,
            imgInit: opt.imgInit || 2,
            autoPlay: opt.autoPlay || false,
            switchTime: opt.switchTime || 3000,
            animateTime: opt.animateTime || 400,
            dotsClass: opt.dotsClass || 'slider-dots',
            dotsSelectedId: opt.dotsSelectedId || 'slider-dot-select',
            showDot: opt.showDot !== undefined ? opt.showDot : true,
            slideEnd: opt.slideEnd || null,
            slideStart: opt.slideStart || null,
            _needPlay: true,
            _direction: opt.direction !== undefined ? opt.direction : 1,
            _jumpFlagOrigin: false
        };
        self.init();
        self.start();
    };
    Slider.prototype = {
        constructor: Slider,
        moveFlag: false,
        transitionEndFlag: true,
        init: function() {
            var self = this,o = self.data;
            o.moveDirection = o._direction == 1 ? 'right': 'left';
            self.doubleChildren();
            o.dom.addClass('slider');
            var width = o.dom[0].offsetWidth,
                height = o.dom[0].offsetHeight,
                items = o.dom.children(),
                wheel = $('<div></div>'),
                dotContainer = $(wheel).clone(),
                dot = $('<b></b>'),
                lazyImgs = [],
                i = 0, j, img, len = items.length;
            for (; i < items.length; i++) {
                j = $(items[i]).clone(true);
                $(j).addClass('slider-item');
                $(j).css('width', width + 'px');
                $(wheel).append(j);
                $(wheel).addClass('slide-wrapper clearfloat');
                img = $(j).find('img')[0];
                if (i < o.imgInit) {
                    img && !img.src && img.getAttribute('lazyload') && (img.src = img.getAttribute('lazyload'));
                } else {
                    lazyImgs.push(img);
                }
            }
            for (var k = 0; k <= o.Maxlen; k++) {
                $(dotContainer).append(dot.clone());
            }
            // wheel.style.height = height + 'px';
            $(wheel).css({'position':'relative','left':'-' + o.index * width + 'px','width':width * len + 'px'});
            $(dotContainer).addClass(o.dotsClass);
            o.showDot || ($(dotContainer).hide());
            o.dom.html('').append($(wheel));
            o.dom.append(dotContainer);
            o.wheel = wheel;
            o.items = wheel.children();
            o.length = o.items.length;
            if (o.length == 1) {
                dotContainer.hide();
            }
            o.dots = dotContainer.children();
            if(o.dots.length >0){
                $(o.dots[o.index - o.Prevlen - 1]).addClass(o.dotsSelectedId);
            }
            o.width = width;
            // o.height = height;
            o.lazyImgs = lazyImgs;
        },
        doubleChildren:function(){
            var self = this , o = self.data;
            var temp,Maxlen = o.dom.children().length - 1,halfChildsLen = parseInt(Maxlen /2);
            self.data.Maxlen = Maxlen;
            self.data.Prevlen = halfChildsLen;
            self.data.Lastlen = Maxlen+halfChildsLen+1;
            self.data.index = halfChildsLen + 1;
            var childs = o.dom.children();
            for (var i = 0; i < halfChildsLen ; i++) {
                temp = $(childs[i]).clone(true);
                o.dom.append(temp);
            }
            for (var j = Maxlen ; j >= Maxlen - halfChildsLen; j--) {
                temp = $(childs[j]).clone(true);
                $(temp).insertBefore(o.dom.children().first());
            }
        },
        changeCurentPosition:function(){
            var self = this , o = self.data;
            if(o.index <= o.Prevlen && o.moveDirection == 'right'){
                o.index = o.index + o.Maxlen + 1;
                $(o.wheel).css({'position':'relative','left':'-' + (o.index * o.width) + 'px'});
            }
            else if(o.index >= o.Lastlen  + 1 && o.moveDirection == 'left'){
                o.index = o.index - (o.Maxlen + 1);
                $(o.wheel).css({'position':'relative','left':'-' + (o.index * o.width) + 'px'});
            }
        },
        _jugeDirection:function(){
            var self = this,o = self.data;
            if(o.curIndex - o.index < 0){
                o.moveDirection = 'left';
            }
            else if(o.curIndex - o.index > 0){
                o.moveDirection = 'right';
            }
            self.changeCurentPosition();
        },
        // 轮播位置判断
        _slide: function(index, auto, flagAnimate) {
            var self = this,o = self.data,length = o.length;
                self._move(index, flagAnimate);
            self.data.slideStart && self.data.slideStart.apply(self);
            return self;
        },
        // 轮播方法
        _move: function(index, flagAnimate) {
            var o = this.data, self = this, thisIndex = o.index;
            self.transitionEndFlag = false;
            if (o.lazyImgs.length) {
                var j = $(o.items[index]).find('img')[0];
                j && !$(j).attr('src') && (j.src = $(j).attr('lazyload'));
            }
            o.index = index;
            o.wheel.animate({'left':'-' + (index * o.width) + 'px'},o.animateTime,'easeInOutExpo',function(){
                self.moveFlag = false;
                self._jugeDirection();
                if (o.showDot) {
                    $('.' + o.dotsSelectedId).removeClass(o.dotsSelectedId);
                    $(o.dots[o.index-o.Prevlen-1]).addClass(o.dotsSelectedId);
                }
                self._setTimeout();
                self.data.slideEnd && self.data.slideEnd.apply(self);
                self.transitionEndFlag = true;
            });
        },
        _closeCallFlag: function() {
            this.data._jumpFlagOrigin = false;
        },
        _openCallFlag: function() {
            this.data._jumpFlagOrigin = true;
        },
        // 设置自动播放
        _setTimeout: function() {
            var self = this,o = self.data;
            if (!o._needPlay || !o.autoPlay)
                return self;
            clearTimeout(o.play);
            o.play = setTimeout(function() {
                o.curIndex = o.index;
                self._slide.call(self, o.index + o._direction, true);
            }, o.switchTime);
            return self;
        },
        start: function() {
            var self = this;
            self.data._needPlay = true;
            self._setTimeout();
            return self;
        },
        stop: function() {
            var self = this;
            clearTimeout(self.data.play);
            self.data._needPlay = false;
            return self;
        },
        prev: function() {
            var self = this,o = self.data;
            o.curIndex = o.index;
            if(self.transitionEndFlag)
                return this._slide(this.data.index - 1, false);
        },
        next: function() {
            var self = this,o = self.data;
            o.curIndex = o.index;
            if(self.transitionEndFlag)
                return this._slide(this.data.index + 1, false);
        },
        moveTo: function(numb) {
            var self = this,o = self.data;
            var index = numb + o.Prevlen+1;if(self.transitionEndFlag) 
            if(self.transitionEndFlag) 
                return this._slide(index, false);
        }
    };
    window.Slider = Slider;
}(window));

