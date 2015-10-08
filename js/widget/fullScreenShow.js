/*
* @file 全屏滑动展示组件
* @import zepto.js
*
* @author huzhongchun
* @date 2015/05/08
*
*/
(function(window){//定义组件


    function fullScreenShowObject(options) {
        var funcNone = function(){};
        this.options = $.extend({
            id: 'full-screen-container',
            index: 0,
            isShowTips: true,
            tipsMessages: '向上滑动',
            backMaxLength: 100,
            animateTime: 0.4,
            animateEndCallback: funcNone
            },options);
        this.init();
    }
    fullScreenShowObject.prototype =   {
        init: function() {//组件初始化函数
            var self = this, opt = this.options;
            var w_height = $(window).height();
            opt.direction = null;
            self.page = {};
            self.$dom = $('#' + opt.id);
            self.$dom.css({
                'width': '100%',
                'height': w_height,
                'position': 'relative',
                'overflow': 'hidden'
            });
            var childs = self.$dom.children();
            childs.css({
                'position': 'absolute',
                'width': '100%',
                'height': '100%',
                'overflow': 'hidden',
                'left': 0,
                'top': 0
            })
            var l = childs.length;
            childs.addClass('hide');
            $(childs[opt.index]).addClass('active').removeClass('hide');
            if (opt.isShowTips) {
                var tipsContent = '<div class="tips">' + opt.tipsMessages + '</div>';
                $('#wrapper').append(tipsContent);
                setTimeout(function() {
                    var w = $('.tips').width();
                    $('.tips').css('left', (160 - w / 2) + 'px');
                }, 100)
            }
            self.$dom.on('touchstart', function(e) {
                e.preventDefault();
                self.page.startY = e.touches[0].pageY;
                self.page.movedY = 0;
                var translateArray = self.getTranslateArray();
                self.page.currentY = parseInt(translateArray[1]);
                opt.index = $('.active').index();

                if (opt.index != l - 1)
                    $(childs[opt.index + 1]).addClass('z-index-high').removeClass('hide').css({
                        '-webkit-transform': 'translate3d(0px, ' + w_height + 'px, 0px)',
                        'transition': 'all 0s ease 0s'
                    });
                if (opt.index !== 0)
                    $(childs[opt.index - 1]).addClass('z-index-high').removeClass('hide').css({
                        '-webkit-transform': 'translate3d(0px, ' + (-w_height) + 'px, 0px)',
                        'transition': 'all 0s ease 0s'
                    });
            });
            self.$dom.on('touchmove', function(e) {
                e.preventDefault();
                self.page.endY = e.touches[0].pageY;
                self.page.movedY = self.page.endY - self.page.startY;
                if (!opt.direction)
                    opt.direction = self.page.movedY > 0 ? 'down' : 'up'; /*只确定最开始的一个方向，往后即使方向改变了，也不作处理*/
                if (opt.direction == 'down') {
                    if (opt.index !== 0) {
                        $(childs[opt.index - 1]).css('-webkit-transform', 'translate3d(0px, ' + (-w_height + self.page.movedY) + 'px, 0px)');

                    }
                }
                else {
                    if (opt.index != l - 1)
                        $(childs[opt.index + 1]).css('-webkit-transform', 'translate3d(0px, ' + (w_height + self.page.movedY) + 'px, 0px)');
                }

            });
            self.$dom.on('touchend touchcancel', function(e) {
                var translateArray = self.getTranslateArray();
                self.page.touchEndY = parseInt(translateArray[1]);
                if (opt.direction == 'down') {
                    if (self.page.movedY !== 0 && opt.index !== 0) {
                        if (self.page.movedY > opt.backMaxLength) {
                            $(childs[opt.index - 1]).addClass('active').removeClass('z-index-high').css({
                                '-webkit-transform': 'translate3d(0px, 0px, 0px)',
                                'transition': 'all ' + opt.animateTime + 's ease 0s'
                            });
                            $(childs[opt.index]).removeClass('active');
                            childs.off('webkitTransitionEnd');
                            $(childs[opt.index - 1]).on('webkitTransitionEnd', function(e) {
                                if (e.propertyName == 'transform') {
                                    var index = opt.index - 1;
                                    opt.animateEndCallback.call(self, index);
                                }
                            })
                        }
                        else {
                            $(childs[opt.index - 1]).css({
                                '-webkit-transform': 'translate3d(0px, ' + (-w_height) + 'px, 0px)',
                                'transition': 'all ' + opt.animateTime + 's ease 0s'
                            });
                        }
                    }
                }
                else {
                    if (self.page.movedY !== 0 && opt.index != l - 1) {
                        if (self.page.movedY > -opt.backMaxLength) {
                            $(childs[opt.index + 1]).css({
                                '-webkit-transform': 'translate3d(0px, ' + w_height + 'px, 0px)',
                                'transition': 'all ' + opt.animateTime + 's ease 0s'
                            });
                        }
                        else {
                            $(childs[opt.index]).removeClass('active');
                            $(childs[opt.index + 1]).addClass('active').removeClass('z-index-high').css({
                                '-webkit-transform': 'translate3d(0px, 0px, 0px)',
                                'transition': 'all ' + opt.animateTime + 's ease 0s'
                            });
                            childs.off('webkitTransitionEnd');
                            $(childs[opt.index + 1]).on('webkitTransitionEnd', function(e) {
                                if (e.propertyName == 'transform') {
                                    var index = opt.index + 1;
                                    opt.animateEndCallback.call(self, index);
                                }
                            })
                        }
                    }
                }
                opt.direction = null;
            });
        },
        getTranslateArray: function() {
            var self = this, opt = this.options;
            var $content = $('#full-screen-container');
            var translateCss = $content.css('-webkit-transform');
            var translateArray;
            if (translateCss.indexOf('matrix') > -1 || translateCss == 'none')
                translateArray = ['0', '0', '0'];
            else
                translateArray = $.trim(translateCss).match((/-?\d*?.?\d*px/g));
            return translateArray;
        }
    }
    F.addWidget('fullScreenShowObject', fullScreenShowObject);
})(window)