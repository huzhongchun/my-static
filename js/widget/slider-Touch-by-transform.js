(function(window, undefined) {
    //ajax
    /*
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
    var SliderObject = function(id, opt) {
        var self = this;
        opt = opt || {};
        self.data = {
            dom: document.getElementById(id.replace(/^#/, '')),
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
        self.initEvent();
        self.start();
    };
    SliderObject.prototype = {
        constructor: SliderObject,
        moveFlag: false,
        init: function() {
            var self = this,o = self.data;
            o.moveDirection = o._direction == 1 ? 'right': 'left';
            self.doubleChildren();
            o.dom.className += ' slider';
            var width = o.dom.offsetWidth,
                height = o.dom.offsetHeight,
                items = o.dom.children,
                wheel = document.createElement('div'),
                dotContainer = wheel.cloneNode(),
                dot = document.createElement('b'),
                lazyImgs = [],
                i = 0, j, img, len = items.length;

            for (; i < items.length; i++) {
                j = items[i].cloneNode(true);
                j.className += ' slider-item';
                j.style.cssText += 'width:' + width + 'px';
                wheel.appendChild(j);
                wheel.setAttribute('class', 'slide-wrapper clearfloat');
                img = j.getElementsByTagName('img')[0];
                if (i < o.imgInit) {
                    img && !img.src && img.getAttribute('lazyload') && (img.src = img.getAttribute('lazyload'));
                } else {
                    lazyImgs.push(img);
                }
            }
            for (var k = 0; k <= o.Maxlen; k++) {
                dotContainer.appendChild(dot.cloneNode());
            }
            wheel.style.width = width * len + 'px';
            // wheel.style.height = height + 'px';
            wheel.style.cssText += 'position:relative;transform:translate3d(-' + o.index * width + 'px,0,0);-webkit-transform:translate3d(-' + o.index * width + 'px,0,0)';
            var hasDotsClass = document.getElementsByClassName(o.dotsClass);
            if(hasDotsClass){
                for (i = 0; i < hasDotsClass.length; i++) {
                    hasDotsClass[i].parentNode.removeChild(hasDotsClass[i]);
                }
            }
            dotContainer.className = o.dotsClass;
            o.showDot || (dotContainer.style.display = 'none');
            $(o.dom).html('').append($(wheel));
            o.dom.appendChild(dotContainer);
            o.wheel = wheel;
            o.items = wheel.children;
            o.length = o.items.length;
            if (o.length == 1) {
                dotContainer.style.display = 'none';
            }
            o.dots = dotContainer.children;
            if(o.dots.length >0){
                o.dots[o.index - o.Prevlen - 1].className = o.dotsSelectedId;
            }
            o.width = width;
            // o.height = height;
            o.lazyImgs = lazyImgs;
        },
        doubleChildren:function(){
            var self = this , o = self.data;
            var temp,Maxlen = o.dom.children.length - 1,halfChildsLen = parseInt(Maxlen /2);
            self.data.Maxlen = Maxlen;
            self.data.Prevlen = halfChildsLen;
            self.data.Lastlen = Maxlen+halfChildsLen+1;
            self.data.index = halfChildsLen + 1;
            function getDomChilds(){
                return o.dom.children;
            }
            var childs = getDomChilds();
            /*不能直接使用 var childs = o.dom.children，因为这样childs直接指向了o.dom.children对象的引用*/
            /*会导致childs跟着o.dom的元素添加而同时变化，从而引起死循环*/
            for (var i = 0; i < halfChildsLen ; i++) {
                temp = childs[i].cloneNode(true);
                o.dom.appendChild(temp);
            }
            for (var j = Maxlen ; j >= Maxlen - halfChildsLen; j--) {
                temp = childs[j].cloneNode(true);
                o.dom.insertBefore(temp,o.dom.firstChild);
            }
        },
        changeCurentPosition:function(){
            var self = this , o = self.data;
            if(o.index <= o.Prevlen && o.moveDirection == 'right'){
                o.index = o.index + o.Maxlen + 1;
                o.wheel.style.cssText += '-webkit-transition: 0ms;-moz-transition: 0ms;-ms-transition: 0ms;position:relative;transform:translate3d(-' + (o.index * o.width) + 'px,0,0);-webkit-transform:translate3d(-' + (o.index * o.width) + 'px,0,0)';
            }
            else if(o.index >= o.Lastlen  + 1 && o.moveDirection == 'left'){
                o.index = o.index - (o.Maxlen + 1);
                o.wheel.style.cssText += '-webkit-transition: 0ms;-moz-transition: 0ms;-ms-transition: 0ms;position:relative;transform:translate3d(-' + (o.index * o.width) + 'px,0,0);-webkit-transform:translate3d(-' + (o.index * o.width) + 'px,0,0)';
            }
        },
        initEvent: function() {
            var self = this,o = self.data,wheel = o.wheel;
            if ( !wheel.addEventListener ) {
                wheel.addEventListener = wheel.attachEvent;
            }
            wheel.addEventListener('touchstart', function(e) {
                o.pageX = e.touches[0].pageX;
                o.pageY = e.touches[0].pageY;
                o.S = false;      //isScrolling
                o.T = false;      //isTested
                o.X = 0;          //horizontal moved
                o.wheel.style.webkitTransitionDuration = '0ms';
                o.curIndex = o.index;
            });
            wheel.addEventListener('touchmove', function(e) {
                self._closeCallFlag();
                var X = o.X = e.touches[0].pageX - o.pageX;
                if (!o.T) {
                    var S = Math.abs(X) < Math.abs(e.touches[0].pageY - o.pageY);
                    S || clearTimeout(o.play);
                    o.T = true;
                    o.S = S;
                }
                if (!o.S) {
                    e.stopPropagation();
                    e.preventDefault();
                    self.moveFlag = true;
                    if (self.data.index === 0 || self.data.index == (self.data.length - 1)) {
                        if (Math.abs(X) < 100) {
                            o.wheel.style.transform = 'translate3d('+(X - o.index * o.width) + 'px,0,0);-webkit-translate3d('+(X - o.index * o.width) + 'px,0,0)';
                        }
                    } else {
                            o.wheel.style.transform = 'translate3d('+(X - o.index * o.width) + 'px,0,0);-webkit-translate3d('+(X - o.index * o.width) + 'px,0,0)';
                    }
                }
            });
            var touchEnd = function() {
                o.S || self._slide(o.index + (o.X <= -20 ? Math.ceil(-o.X / o.width) : (o.X > 20) ? -Math.ceil(o.X / o.width) : 0));
                
            };
            function transitionEndCallback(){
                self.moveFlag = false;
                if(o.curIndex - o.index < 0){
                    o.moveDirection = 'left';
                }
                else if(o.curIndex - o.index > 0){
                    o.moveDirection = 'right';
                }
                self.changeCurentPosition();
                if (o.showDot) {
                    o.dom.querySelector('.' + o.dotsSelectedId).setAttribute('class', '');
                    o.dots[o.index - o.Prevlen - 1].className = o.dotsSelectedId;
                }
                self._setTimeout();
                self.data.slideEnd && self.data.slideEnd.apply(self);
                
            }

            wheel.addEventListener('touchend', touchEnd);
            wheel.addEventListener('touchcancel', touchEnd);
            wheel.addEventListener('webkitTransitionEnd', transitionEndCallback);
            wheel.addEventListener('transitionend', transitionEndCallback);
        },
        // 轮播位置判断
        _slide: function(index, auto, flagAnimate) {
            var self = this,o = self.data,length = o.length;
            //if (-1 < index && index < length) {
                self._move(index, flagAnimate);
            // } else if (index >= length) {
            //     self._move(length - (auto ? 2 : 1), flagAnimate);
            //     o._direction = -1;
            // } else {
            //     self._move(auto ? 1 : 0, flagAnimate);
            //     o._direction = 1;
            // }
            self.data.slideStart && self.data.slideStart.apply(self);
            return self;
        },
        // 轮播方法
        _move: function(index, flagAnimate) {
            var o = this.data, self = this, thisIndex = o.index;
            if (o.lazyImgs.length) {
                var j = o.items[index].getElementsByTagName('img')[0];
                j && !j.src && (j.src = j.getAttribute('lazyload'));
            }
            o.index = index;

            //                        if(flagAnimate == 2){
            //                            self._openCallFlag();
            //                        }
            if (flagAnimate == 1) {
                o.wheel.style.removeProperty('-webkit-transition');
                o.wheel.style.cssText += 'position:relative;transform:translate3d(-' + index * o.width + 'px,0,0);-webkit-transform:translate3d(-' + index * o.width + 'px,0,0)';
                document.getElementById(o.dotsSelectedId).id = '';
                o.dots[2].id = o.dotsSelectedId;
            } else {
                if (index == -1 || index == o.length) {
                    o.wheel.style.cssText += '-webkit-transition:' + o.animateTime + 'ms;-moz-transition:' + o.animateTime + 'ms;-ms-transition:' + o.animateTime + 'ms;position:relative;transform:translate3d(-' + (index * o.width - 100) + 'px,0,0);-webkit-transform:translate3d(-' + (index * o.width - 100) + 'px,0,0)';
                } else {
                    o.wheel.style.cssText += '-webkit-transition:' + o.animateTime + 'ms;-moz-transition:' + o.animateTime + 'ms;-ms-transition:' + o.animateTime + 'ms;position:relative;transform:translate3d(-' + index * o.width + 'px,0,0);-webkit-transform:translate3d(-' + index * o.width + 'px,0,0)';
                    if ((thisIndex == 3) && (flagAnimate == 2)) {
                        //  self._closeCallFlag();
                        o.slideEnd && o.slideEnd.apply(self);
                    }

                }
            }
        },
        _closeCallFlag: function() {
            this.data._jumpFlagOrigin = false;
        },
        _openCallFlag: function() {
            this.data._jumpFlagOrigin = true;
        },
        // 设置自动播放
        _setTimeout: function() {
            var self = this,
                    o = self.data;
            if (!o._needPlay || !o.autoPlay)
                return self;
            clearTimeout(o.play);
            o.play = setTimeout(function() {
                o.curIndex = o.index;
                self._slide.call(self, o.index + o._direction, true);
            }, o.switchTime);
            return self;
        },
        // 重设容器及子元素宽度
        _resize: function() {

            var self = this,
                    o = self.data,
                    width = o.dom.offsetWidth,
                    items = o.items, dot = document.createElement('b');
            o.length = $('#slider .slider-item').length;
            var length = o.length;
            if (!width)
                return self;
            o.width = width;
            clearTimeout(o.play);
            var sliderNot = document.querySelector('.slider-dots');
            sliderNot.innerHTML = '';
            for (var i = 0; i < length; i++) {
                items[i].style.cssText += 'width:' + width + 'px;';
                sliderNot.appendChild(dot.cloneNode());
            }
            o.dots = sliderNot.children;
            o.dots[o.index].id = o.dotsSelectedId;
            o.wheel.style.removeProperty('-webkit-transition');
            o.wheel.style.cssText += 'width:' + width * length + 'px;position:relative;transform:translate3d(-' + o.index * width + 'px,0,0);-webkit-transform:translate3d(-' + o.index * width + 'px,0,0)';
            o._direction = 1;

            $('.slider-dots').html();
            self._setTimeout();
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
            var self = this,
                    o = self.data;
            o.curIndex = o.index;
            return this._slide(this.data.index - 1, false);
        },
        next: function() {
            var self = this,
                    o = self.data;
            o.curIndex = o.index;
            return this._slide(this.data.index + 1, false);
        },
        moveTo: function(numb) {
            var self = this,o = self.data;
            var index = numb + o.Prevlen+1;
            return this._slide(index, false);
        },
        refresh:function(){
            this.init();
            this.initEvent();
        }
    };
   
    F.addWidget('SliderObject', SliderObject);
}(window));

