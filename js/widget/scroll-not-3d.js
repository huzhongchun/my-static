(function(window){/**
 * @name 滚动条组件
 * 
 * @param {string} id 调用的元素
 * ------ {function} pullDownCallback   到顶部后继续往下滑动的回调函数，实现下拉刷新等功能
 * ------ {function} pullUpCallback     到底部后继续往上滑动的回调函数，实现上拉加载更多等功能
 * ------ {function} startPullDownCallback 开始下拉回调函数
 * ------ {int} startPullDownMaxLength 下拉弹性的距离
 * 
 */
    var scrollObject = function(options) {
        var fnNone = function() {
        }
        this.settings = $.extend({
            id: 'scroll-box', //调用的元素
            pullDownCallback: fnNone,
            pullUpCallback: fnNone,
            startPullDownCallback: fnNone,
            startPullDownMaxLength: 40
        },options)
        this.init();
    }
    scrollObject.prototype = {
        constructor:scrollObject,
        init: function() {
            var self = this, opt = this.settings;
            self.time = {}, self.pageXY = {}, self.speed = 0, self.direction = null, self.parentHeight = 0;
            if (!opt.id || !$('#'+opt.id)) {
                console.log('id或dom为null!');
                return false;
            }
            self.dom = $('#'+opt.id);
            var $parent = $(this.dom).parent();
            $parent.css('overflow', 'hidden');
            self.addListener();
        },
        addListener: function() {
            var self = this, opt = this.settings;
            var p = self.pageXY;
            self.touchendFlag = true;
            var $content = $(self.dom);
            $content.on('touchstart', function(e) {
                //e.preventDefault();
                self.time.startT = (new Date()).getTime();
                p.startX = e.touches[0].pageX;
                p.startY = e.touches[0].pageY;
                var translateArray = self.getTranslateArray();
                p.currentX = parseInt(translateArray[0]);
                p.currentY = parseInt(translateArray[1]);
                self.stopMoveByCss(p.currentY);
                self.maxMove = self.getMaxMove();
            });
            $content.on('touchmove', function(e) {
                e.preventDefault();
                p.endX = e.touches[0].pageX;
                p.endY = e.touches[0].pageY;
                p.moveX = p.endX - p.startX;
                p.movedY = p.endY - p.startY;
                self.direction = p.movedY > 0 ? 'up' : 'down';
                p.targetX = p.currentX + p.movedX;
                p.targetY = p.currentY + p.movedY;
                if (p.currentY <= '0' && p.targetY > 0 && self.touchendFlag) {
                    opt.startPullDownCallback();
                    self.touchendFlag = false;
                }
                //self.maxMove > 0 用来判断 如果没有可以滑动的距离，那么就禁止滑动
                if (p.currentY <= opt.startPullDownMaxLength && p.targetY > opt.startPullDownMaxLength && self.maxMove > 0) {
                    $content.css('-webkit-transform', 'translate(0px, 40px)');
                    //opt.startPullDownCallback();
                }
                else {
                    if(self.maxMove > 0){
                        if (p.targetY < -(self.maxMove + opt.startPullDownMaxLength))
                            $content.css('-webkit-transform', 'translate(0px, ' + (-(opt.startPullDownMaxLength + self.maxMove)) + 'px)');
                        else
                            $content.css('-webkit-transform', 'translate(0px, ' + p.targetY + 'px)');
                    }
                }
            });
            $content.on('touchend', function(e) {
                var inertiaTime, inertiaMoveY;
                var target;
                self.touchendFlag = true;
                var translateArray = self.getTranslateArray();
                p.touchEndX = parseInt(translateArray[0]);
                p.touchEndY = parseInt(translateArray[1]);
                self.time.endT = (new Date()).getTime();
                self.time.moveingT = self.time.endT - self.time.startT;
                p.moveLen = p.touchEndY - p.currentY;
                self.speed = Math.abs(p.moveLen / self.time.moveingT);
                inertiaTime = self.time.moveingT / 200;
                inertiaMoveY = self.speed * 500;
                if (self.direction === 'down')
                    target = p.touchEndY - inertiaMoveY;
                else
                    target = p.touchEndY + inertiaMoveY;
                //判断是否超出移动范围
                if (target >= opt.startPullDownMaxLength)
                    target = opt.startPullDownMaxLength;
                if (target < -(self.maxMove + opt.startPullDownMaxLength))
                    target = -(self.maxMove + opt.startPullDownMaxLength);
                self.moveByCss(inertiaTime, target);
                self.monitor();
            });
        },
        getTranslateArray: function() {
            var self = this,translateArray;
            var $content = $(this.dom);
            //var translateCss = $content.css('-webkit-transform');
            // if (translateCss.indexOf('matrix') > -1 || translateCss == 'none')
            //     translateArray = ['0', '0', '0'];
            // else
            //     translateArray = $.trim(translateCss).match((/-?\d*?.?\d*px/g));
            
            //getComputedStyle获取元素的当前位置比css方法更为的准确
            var translateCss = window.getComputedStyle( $content[0])['-webkit-transform'].split(')')[0].split(', ');
            if(translateCss[0] === 'none')
                translateArray = ['0','0','0']
            else
                translateArray = [(translateCss[12] || translateCss[4]),(translateCss[13] || translateCss[5]),'0']
            
            return translateArray;
        },
        stopMoveByCss: function(currentY) {
            var self = this;
            var $content = $(this.dom);
            $content.css({'-webkit-transition': '-webkit-transform 0s ease-out 0s', 'transition': '-webkit-transform 0s ease-out 0s'});
            $content.css('-webkit-transform', 'translate(0px, ' + currentY + 'px)');
        },
        moveByCss: function(time, target) {
            var self = this, opt = this.settings;
            var $content = $(this.dom);
            $content.css({'-webkit-transition': '-webkit-transform ' + time + 's cubic-bezier(0.333333,0.666667,0.66667,1) 0s', 'transition': '-webkit-transform ' + time + 's cubic-bezier(0.333333,0.666667,0.66667,1) 0s'});
            $content.css('-webkit-transform', 'translate(0px, ' + target + 'px)');
        },
        offset: function(elem) {
            var left = 0,
                    top = 0,
                    _this = elem;
            while (_this.offsetParent) {
                left += _this.offsetLeft;
                top += _this.offsetTop;
                _this = _this.offsetParent;
            }
            return {
                "left": left,
                "top": top
            }
        },
        getMaxMove: function() {
            var self = this, opt = this.settings;
            var height = $('#' + opt.id).height();         /*用this.id及时更新dom的状态*/
            var maxMove = height - $(this.dom).parent().height();
            if (maxMove < 0)
                maxMove = 0;
            return maxMove;
        },
        monitor: function() {
            var self = this, opt = this.settings;
            var $content = $(this.dom);
            var callbackFn;
            //因为还有惯性滚动的距离，所以得一直循环获取当前的位置信息
            var loop = setInterval(function() {
                var translateArray = self.getTranslateArray();
                var translateY = parseInt(translateArray[1]);
                if (translateY > 0) {
                    self.stopMoveByCss(translateY);
                    self.moveByCss('0.5', 0);
                    callbackFn = function() {
                        opt.pullDownCallback();
                        $content.off('webkitTransitionEnd');
                    };
                    callbackFn();
                    //如果需要在动画结束后执行回调，启用一下一句程序。
                    //$content.on('webkitTransitionEnd', callbackFn);
                    clearInterval(loop);
                }
                if (translateY < -(self.maxMove)) {
                    self.stopMoveByCss(translateY);
                    self.moveByCss('0.5', -self.maxMove);
                    callbackFn = function() {
                        opt.pullUpCallback();
                        $content.off('webkitTransitionEnd');
                    };
                    callbackFn();
                    //如果需要在动画结束后执行回调，启用一下一句程序。
                    //$content.on('webkitTransitionEnd', callbackFn);
                    clearInterval(loop);
                }
            }, 100);
        }
    }

    F.addWidget('scrollObject', scrollObject);
})(window)