/*
* @file 全屏滑动展示组件
* @import zepto.js
*
* @author huzhongchun
* @date 2015/05/08
*
*/

(function(window){

    var H5FullscreenPageObject = function(options){
        this.settings = $.extend({
            'type' : 1,
            'pageShow' : function(){},
            'pageHide' : function(){},
            'useShakeDevice' : {
                'speed' : 30,
                'callback' : function(){}
            },
            'useParallax' : true,
            'useArrow' : true,
            'useAnimation' : true,
            'useMusic' : {
                'autoPlay' : true,
                'loopPlay' : true,
                'src' : 'http://mat1.gtimg.com/news/2015/love/FadeAway.mp3'
            },
            'dragThreshold': 0.15,
            'passedNoAnimate': false //滑动显示过的页面下次是否还动画显示里面的元素
        },options);

        this.init();
    }
    H5FullscreenPageObject.prototype = {
        constructor: H5FullscreenPageObject,
        currentItem:null,
        percentage:null,//拖动量的百分比
        dragStart : null,//开始抓取标志位
        page:{},
        animateType: {
            '1' : {
                'upDrag' : function(percentage, item){
                    var translateY = 1 - 0.7*percentage;//位置系数，可以微调
                    item.next().css('-webkit-transform', 'translate3d(0,'+translateY*100+'%,0)'); //下一个item上移动
                },
                'downDrag' : function(percentage, item){
                    var translateY = -(0.7*percentage);
                    item.prev().css('-webkit-transform', 'translate3d(0,'+(translateY*100 - 100)+'%,0)');
                    item.css('-webkit-transform', 'translate3d(0,'+translateY*100+'%,0)');//当前item下移动
                },
                'nextSlide' : function(item){
                    item.css('-webkit-transform', 'translate3d(0,-100%,0)'); 
                    item.next().css('-webkit-transform', 'translate3d(0,0,0)');
                },
                'prevSlide' : function(item){
                    item.prev().css('-webkit-transform', 'scale(1)'); 
                    item.css('-webkit-transform', 'translate3d(0,100%,0)'); 
                },
                'showSlide' : function(item){
                    item.css('-webkit-transform', 'scale(1)'); 
                    item.next().css('-webkit-transform', 'translate3d(0,100%,0)'); 
                }
            },
            '2' : {
                'upDrag' : function(percentage, item){
                    var scale = 1 - 0.2*percentage;//缩放系数，可以微调
                    var translateY = 1 - 0.7*percentage;//位置系数，可以微调
                    item.css('-webkit-transform', 'scale('+scale+')');//当前item缩小
                    item.next().css('-webkit-transform', 'translate3d(0,'+translateY*100+'%,0)'); //下一个item上移动
                },
                'downDrag' : function(percentage, item){
                    var scale = 0.8 - 0.2*percentage;
                    var translateY = -(0.7*percentage);
                    item.css('-webkit-transform', 'translate3d(0,'+translateY*100+'%,0)');//当前item下移动
                    item.prev().css('-webkit-transform', 'scale('+scale+')');//前一个item放大
                },
                'nextSlide' : function(item){
                    item.css('-webkit-transform', 'scale(.8)'); 
                    item.next().css('-webkit-transform', 'translate3d(0,0,0)');
                },
                'prevSlide' : function(item){
                    item.prev().css('-webkit-transform', 'scale(1)'); 
                    item.css('-webkit-transform', 'translate3d(0,100%,0)'); 
                },
                'showSlide' : function(item){
                    item.css('-webkit-transform', 'scale(1)'); 
                    item.next().css('-webkit-transform', 'translate3d(0,100%,0)'); 
                }
            },
            '3' : {
                'upDrag' : function(percentage, item){
                    var translateY = 1 - 0.4*percentage;//位置系数，可以微调
                    item.css('-webkit-transform', 'translate3d(0,'+(translateY*100 - 100)+'%,0)');
                    item.next().css('-webkit-transform', 'translate3d(0,'+translateY*100+'%,0)'); //下一个item上移动
                },
                'downDrag' : function(percentage, item){
                    var translateY = -(0.4*percentage);
                    item.prev().css('-webkit-transform', 'translate3d(0,'+(translateY*100 - 100)+'%,0)');
                    item.css('-webkit-transform', 'translate3d(0,'+translateY*100+'%,0)');//当前item下移动
                },
                'nextSlide' : function(item){
                    item.css('-webkit-transform', 'translate3d(0,-100%,0)'); 
                    item.next().css('-webkit-transform', 'translate3d(0,0,0)');
                },
                'prevSlide' : function(item){
                    item.prev().css('-webkit-transform', 'scale(1)'); 
                    item.css('-webkit-transform', 'translate3d(0,100%,0)'); 
                },
                'showSlide' : function(item){
                    item.css('-webkit-transform', 'scale(1)'); 
                    item.next().css('-webkit-transform', 'translate3d(0,100%,0)'); 
                }
            },
            '4' : {
                'upDrag' : function(percentage, item){
                    var translateY = 1 - 0.4*percentage;//位置系数，可以微调
                    item.css('-webkit-transform', 'translate3d(0,'+(translateY*100 - 100)+'%,0)');
                    item.next().css('-webkit-transform', 'translate3d(0,'+translateY*100+'%,0)'); //下一个item上移动
                },
                'downDrag' : function(percentage, item){
                    var translateY = -(0.4*percentage);
                    item.prev().css('-webkit-transform', 'translate3d(0,'+(translateY*100 - 100)+'%,0)');
                    item.css('-webkit-transform', 'translate3d(0,'+translateY*100+'%,0)');//当前item下移动
                },
                'nextSlide' : function(item){
                    item.addClass('zindex');
                    setTimeout(function(){
                        item.removeClass('no-animation').css('-webkit-transform', 'translate3d(0,-100%,0)');
                        item.next().removeClass('zindex').addClass('no-animation').css('-webkit-transform', 'translate3d(0,0,0)');
                    },100);
                    
                },
                'prevSlide' : function(item){
                    
                    item.prev().css('-webkit-transform', 'translate3d(0,0,0)'); 
                    item.next().css('-webkit-transform', 'translate3d(0,100%,0)'); 
                    item.removeClass('zindex');
                },
                'showSlide' : function(item){
                    item.css('-webkit-transform', 'scale(1)'); 
                    item.next().css('-webkit-transform', 'translate3d(0,100%,0)'); 
                }
            }
        },
        init:function(){
            this.initDom();
            this.initEvent();
            this.addEventListenFunc();
        },
        initDom:function(){
            var self = this ,opt = this.settings;
           $('#scale-wrapper').addClass('H5FullscreenPage');
           self.currentItem = $('.H5FullscreenPage-wrap .item').first();
           self.currentItem.attr('state','next');
           if (opt.useAnimation) {
               var items = $('.H5FullscreenPage-wrap .item');
               items.find('.part').addClass('hide');
               self.orderPartFunc(items.first());
           }
           $('body').append('<div class="overlay"></div>');
           if (opt.useArrow) {
               $('.item').slice(0,$('.item').length-1).append('<span class="arrow"></span>');
           }
           if (opt.useMusic) {
               var autoplay = opt.useMusic.autoPlay ? 'autoplay="autoplay"' : '';
               var loopPlay = opt.useMusic.loopPlay ? 'loop="loop"' : '';
               var src = opt.useMusic.src;
               $('body').append('<span class="music play"><audio id="audio" src='+src+' '+autoplay+' '+loopPlay+'></audio></span>');
           }
        },
        initEvent:function(){
            var self = this ,opt = this.settings;
            if (opt.useParallax) {
                var orginData = {x:0,y:0};
                window.addEventListener('deviceorientation',function(event){
                    var gamma = event.gamma;
                    var beta = event.beta;
                    var x = -gamma;
                    var y = -beta;
                    
                    if (Math.abs(Math.abs(x) - Math.abs(orginData.x)) < 0.1 || Math.abs(Math.abs(y) - Math.abs(orginData.y)) < 0.1) {
                        orginData.x = x;
                        orginData.y = y;
                        return;
                    } else {
                        orginData.x = x;
                        orginData.y = y;
                    }
                    
                    var halfWidth = window.innerWidth / 2;  
                    var halfHeight = window.innerHeight / 2;  
                 
                    
                    var max = 5;
                    var items = $('.parallax');
                    items.forEach(function(item){
                        var dx = (item.getBoundingClientRect().width/max)*(x / halfWidth);
                        var dy = (item.getBoundingClientRect().width/max)*(y / halfHeight);
                        
                        if ($(item).hasClass('item')) {
                            //$(item).addClass('parallax-item');
                            dx = -dx/1 + 50;
                            dy = -dy/1 + 50;
                            item.style['background-position'] = ''+dx+'% '+dy+'%';
                            //$(item).removeClass('parallax-item');
                        } else {
                            item.style['transform'] = item.style['-webkit-transform'] = 'translate3d('+dx+'px,'+dy+'px,0)'; 
                        }
                        
                        
                    });
                     
                   
                }, false);
            }
            if (opt.useShakeDevice && opt.useShakeDevice.speed) {
                var x = 0, y = 0, z = 0, lastX = 0,lastY = 0,lastZ = 0;
                if (window.DeviceMotionEvent) {
                    window.addEventListener('devicemotion',function(eventData){
                        var acceleration =event.accelerationIncludingGravity;
                            x = acceleration.x;
                            y = acceleration.y;
                            z = acceleration.z;
                            if(Math.abs(x-lastX) > opt.useShakeDevicespeed || Math.abs(y-lastY) > opt.useShakeDevicespeed || Math.abs(z-lastZ) > opt.useShakeDevicespeed) {
                                //shake
                                opt.useShakeDevice.callback && opt.useShakeDevice.callback(self.currentItem);
                                
                            }
                            lastX = x;
                            lastY = y;
                            lastZ = z;
                    }, false);  
                }
            }
        },
        addEventListenFunc:function(){
            var self = this,opt = this.settings;
            $('.music').on('tap',function(){
                $(this).toggleClass('play');
                var audio = document.getElementById('audio');
                if (audio.paused) {
                    audio.play();
                } else {
                    audio.pause();
                }
            });
            // 绑定事件
            var touchStartFunc = function(event) {
               if (self.dragStart !== null) return;
               var item = $(event.target).closest('.item');
                if (!item.length) {
                    $('.overlay').hide();
                    return;
                }
               if (event.touches) {
                   event = event.touches[0];
               }
                //抓取时的所在位置
               self.dragStart = event.clientY;
               
                //分别关闭item的动画效果,动画效果只在松开抓取时出现
               item.addClass('no-animation');
               item.next().addClass('no-animation');
               item.prev().addClass('no-animation');
            }
            var touchMoveFunc = function(event) {
                //console.log(33);
                //防止ios拖动事件
                event.preventDefault();
                
                if (self.dragStart === null) return;
                var item = $(event.target).closest('.item');
                 if (!item.length) {
                     $('.overlay').hide();
                     return;
                 }
                if (event.touches) {
                    event = event.touches[0];
                }
                 //得到抓取开始时于进行中的差值的百分比
                self.percentage = (self.dragStart - event.clientY) / window.screen.height;//
                 
                if (self.percentage > 0) {
                    // //向上拖动
                    var scale = 1 - 0.5*self.percentage;//缩放系数，可以微调
                    // var translateY = 1 - 0.4*percentage;//位置系数，可以微调
                    // $(event.target).css('-webkit-transform', 'scale('+scale+')');//当前item缩小
                    // $(event.target).next().css('-webkit-transform', 'translateY('+translateY*100+'%)'); //下一个item上移动
                     //$(event.target).css('opacity', ''+scale+'');//当前item缩小
                     self.animateType[opt.type].upDrag(self.percentage, item);
                     
                } else if (item.prev()) {
                    //向下拖动
                    // var scale = 0.8 - 0.2*percentage;
                    // var translateY = -(0.4*percentage);
                    // $(event.target).css('-webkit-transform', 'translateY('+translateY*100+'%)');//当前item下移动
                    // $(event.target).prev().css('-webkit-transform', 'scale('+scale+')');//前一个item放大
                     self.animateType[opt.type].downDrag(self.percentage, item);
                }
               
            }
            var touchEndFunc = function(event) {
                //防止多次滚动，故增加一个覆盖层,安卓上覆盖层有问题，导致只能第一次能滑动 -------todo
                //$('.overlay').show();
                self.dragStart = null;
                var item = $(event.target).closest('.item');
                if (!item.length) {
                    $('.overlay').hide();
                    return;
                }

                item.removeClass('no-animation');
                item.next().removeClass('no-animation');
                item.prev().removeClass('no-animation');
                
                //抓取停止后，根据临界值做相应判断
                if (self.percentage >= opt.dragThreshold) {
                    self.nextSlideFunc(item);
                } else if ( Math.abs(self.percentage) >= opt.dragThreshold ) {
                    self.prevSlideFunc(item);
                } else {
                    self.showSlideFunc(item);
                }
                 //重置percentage
                self.percentage = 0;

            }
            if (opt.type > 4) {
                opt.type = opt.type - 4;
                $('.H5FullscreenPage-wrap .item').on({
                    'swipeUp': self.swipeUpFunc,
                    'swipeDown': self.swipeDownFunc
                });
            } else {
                $('.H5FullscreenPage-wrap .item').on({
                   'touchstart': touchStartFunc,
                   'touchmove': touchMoveFunc,
                   'touchend': touchEndFunc,
                   'touchcancel': touchEndFunc
                });
            }
            
            $('.H5FullscreenPage-wrap .item').on('tap', function(){
                //覆盖层隐藏
                $('.overlay').hide();
            });
            $('.H5FullscreenPage-wrap .item').on('transitionend', function(event){
                //覆盖层隐藏
                $('.overlay').hide();
                if ($(event.target).attr('state') == 'next') {
                    opt.pageShow(event.target);
                } else {
                    opt.pageHide(event.target);
                }
            }); 
            $('.overlay').on('tap', function(){
                //覆盖层隐藏
                $('.overlay').hide();
            });
        },
        swipeUpFunc: function(event){
            var self = this,opt = this.settings;
            var item = $(event.target).closest('.item');
            if (!item.length) {
                return;
            }
            self.nextSlideFunc(item);
            //$(event.target).css('-webkit-transform', 'translateY(-101%)'); 
            //$(event.target).next().css('-webkit-transform', 'translateY(0)'); 
        },
        swipeDownFunc: function(event){
            var self = this,opt = this.settings;
            var item = $(event.target).closest('.item');
            if (!item.length) {
                return;
            }
            self.prevSlideFunc(item);
            //$(event.target).css('-webkit-transform', 'translateY(101%)'); 
            //$(event.target).prev().css('-webkit-transform', 'translateY(0)'); 
        },
        nextSlideFunc: function(item){
            var self = this,opt = this.settings;
           //恢复到原样，或者展示下一item
           if (item.next().length) { 
                opt.passedNoAnimate ?  null : $('.part').addClass('hide');
                item.attr('state','prev');
                item.siblings('.item').removeAttr('state');
                
                self.currentItem = item.next();
                self.currentItem.attr('state','next');
                self.orderPartFunc(item.next());
                self.animateType[opt.type].nextSlide(item);
           } else {
               self.animateType[opt.type].showSlide(item);
           }
           self.orderPartFunc(self.currentItem);
        },
        prevSlideFunc: function(item){
            var self = this,opt = this.settings;
           //$(event.target).removeClass('parallax-item');
            if (item.prev().length) {
                opt.passedNoAnimate ?  null : $('.part').addClass('hide');
                item.attr('state','prev');
                item.siblings('.item').removeAttr('state');
                self.currentItem = item.prev();
                self.currentItem.attr('state','next');
                self.animateType[opt.type].prevSlide(item);
            } else {
                self.animateType[opt.type].showSlide(item);
            }
            self.orderPartFunc(self.currentItem);
        },
        showSlideFunc:function(item){
            var self = this,opt = this.settings;
           //$(event.target).removeClass('parallax-item');
            self.animateType[opt.type].showSlide(item);
        },
        orderPartFunc:function(dom){
           var parts = $(dom).find('.part');
           parts.forEach(function(item){
               var time = $(item).attr('data-delay') || 100;
               setTimeout(function(){
                   $(item).removeClass('hide');
               },time);
           });
        },
    }
         
        
    F.addWidget('H5FullscreenPageObject', H5FullscreenPageObject);

})(window);