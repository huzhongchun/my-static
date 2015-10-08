(function(window){/**

 */
var AnchorscrollObject = function(options){
    this.settings = $.extend({
        diffDistance: 40
    },options)
}
AnchorscrollObject.prototype = {
    constructor: AnchorscrollObject,
    slideUp : function(height, old) {
        if (height < old) {
            for (var i = 500; i >= 0; i -= 5) {
                (function() {
                    var pos = i;
                    setTimeout(function() {
                        if (pos <= 0) {
                            window.scrollTo(0, height);
                        } else {
                            window.scrollTo(0, old - (pos / 500 * (old - height)));
                        }
                    }, (pos));
                })();
            }
        } else {
            for (var j = 0; j <= 500; j += 5) {
                (function() {
                    var pos = j;
                    setTimeout(function() {
                        window.scrollTo(0, old + (pos / 500 * (height - old)));
                    }, (pos));
                })();
            }
        }
    },
    fireScroll : function(id) {
        var self = this ,opt = this.settings;
        var top = self.getOffsetPositon(document.getElementById(id)).top;
        var height = 0;
        if(opt.height == null){
            height = $(self.element).height();
        }else{
            height = opt.height;
        }
        top = (top - height) * Leyou.scale;
        var scrollHeight = 0;
        scrollHeight = $(window).scrollTop();
        scrollHeight = (scrollHeight) * Leyou.scale;
        self.slideUp(top, scrollHeight);
    },
    getOffsetPositon : function(elem) {
        var left = 0,top = 0,_this = elem;
        while (_this.offsetParent) {
            left += _this.offsetLeft;
            top += _this.offsetTop;
            _this = _this.offsetParent;
        }
        return {
            "left": left,
            "top": top
        }
    }
}

Leyou.widget.AnchorscrollObject = AnchorscrollObject;
})(window)
(function(window){
	var countDownObject = function(options){
		this.settings = $.extend({
			parent : $('#scale-wrapper'),
			targetDate : '2015/12/30 00:00:00'
		},options)
		this.targetTime = (new Date(this.settings.targetDate)).getTime();
		this.tpl = '<div class="count-down-box ">'+
						'<span class="days">00</span>:'+
						'<span class="hours">00</span>:'+
						'<span class="minutes">00</span>:'+
						'<span class="seconds">00</span>'+
					'</div>';
		this.range = {
			days: '00',
			hours: '00',
			minutes: '00',
			seconds: '00'
		}
		this.init();
	}
	countDownObject.prototype = {
		init:function(){
			//初始化计算一下数值，否则会出现全是00再变成实际的差值的过程
			var self = this,opt = this.settings;
			$(opt.parent).append(self.tpl);
			self._calculateTimeFunc();
			self._showTheTimeFunc(self.range);
			self.start();
		},
		_initMonitorFunc:function(){
			var self = this;
			self.timeMonitor = setInterval(function(){
				self._calculateTimeFunc();
				self._showTheTimeFunc(self.range);
			},1000)
		},
		_calculateTimeFunc:function(){
			var self = this,D = 24 * 60 * 60 * 1000,H = 60 * 60 * 1000,M = 60 * 1000,S = 1000;
			var curTime =  (new Date()).getTime();
			var distanceTime = self.targetTime - curTime,leaveTime = 0;
			if(distanceTime >= 0){
				self.range.days = parseInt(distanceTime / D);
				leaveTime = distanceTime % D;
				self.range.hours = parseInt(leaveTime / H);
				leaveTime = leaveTime % H;
				self.range.minutes = parseInt(leaveTime / M);
				leaveTime = leaveTime % M;
				self.range.seconds = parseInt(leaveTime / S);
				self._addZerroFunc(self.range);
			}else{
				self.stop();	
			}
		},
		_addZerroFunc:function(range){
			for(var prop in range){
				if(range[prop] < 10 && range[prop] > -10)
					range[prop] = '0' + range[prop];
			}
		},
		refreshMonitorFunc: function(){
			var self = this;
			clearInterval(self.timeMonitor);
			self._calculateTimeFunc();
		},
		_showTheTimeFunc:function(range){
			var self = this;
			$('.count-down-box .hours').html(range.hours);
			$('.count-down-box .minutes').html(range.minutes);
			$('.count-down-box .seconds').html(range.seconds);
			$('.count-down-box .days').html(range.days);
		},
		start:function(){
			this._initMonitorFunc();
		},
		stop:function(){
			clearInterval(this.timeMonitor);
		}
	}

	//放在widget的命名空间下，避免全局变量污染
	Leyou.widget.countDownObject = countDownObject;
})(window)
(function(window){
/**
 * @file 弹出框组件
 * @import zepto.js
 *
 */
var DialogObject = function(options){
    this.settings = $.extend({
        element: "element",
        //默认弹出框宽度
        width: 300,
        height: 200,
        //传进来显示的html
        content: "This is the content!",
        //弹出框title
        title: "提示", //弹出框的title
        //显示一个按钮还是两个(0,1,2)
        buttonShowType: 2,
        //按钮文字
        ok: '确定',
        cancel: '取消',
        //成功回调函数
        successCallback: null,
        //弹框类型
        type: '',
        //取消回调函数
        cancelCallback: function() {
        }
    },options);
    this.tpl = '<div class="ui-dialog">' +
                    '<div class="ui-dialog-title">'+
                        '<div class="title-txt"><%=title%></div>'+
                        '<div class="ui-dialog-close"></div>'+
                    '</div>' +
                    '<div class="ui-dialog-content"><%=content%></div>' +
                    '<% if(buttonShowType == 2){  %>' +
                        '<div class="ui-dialog-btn">'+
                            '<div class="ui-dialog-cancel"><%=cancel%></div>'+
                            '<div class="ui-dialog-ok"><%=ok%></div>'+
                        '</div>' +
                    '<% }else if(buttonShowType == 1){ %>' +
                        '<div class="ui-dialog-btn">'+
                            '<div class="ui-dialog-ok" style="border-left: none;width: 100%;" ><%=ok%></div>'+
                        '</div>' +
                    '<% } %>' +
                '</div>';
    this.bg = '<div class="ui-bg"></div>';
    this.init();
 }
DialogObject.prototype = {
    constructor:DialogObject,
    init: function() {
        this._appendHtml();
        this._bindEvent();
    },
    _appendHtml: function() {
        var self = this,
            $uiBg = $('.ui-bg'),
            $body = $('body'),
            htmls = Leyou.parseTpl(this.tpl, this.settings);
        this.dialog = $(htmls);
        //初始化dom
        $('#scale-wrapper').append(self.dialog);
        if ($uiBg.length <= 0)
            $body.append(self.bg);
    },
    show: function() {
        var bodyHeight = $('body').height();
        var windowHeight = $(window).height() * (Leyou.scale ? Leyou.scale : 1);
        var height = bodyHeight > windowHeight ? bodyHeight : windowHeight;
        $('.ui-bg').css({'position': 'absolute', 'height': height + 'px','top':'0','left':'0'});
        this._culculate();
        this._setFlag();
        this._animateShow();
    },
    //显示模式
    _animateShow: function() {
        var $bg = $('.ui-bg'),type = this.settings.type;
        $bg.show();
        $bg.animate({
            opacity: 0.5,
        }, 500, 'ease-out');
        switch (type) {
            case 'slidedown':
                this.dialog.show();
                this.dialog.css({'transform': 'translate3d(0,-300px,0)','-webkit-transform': 'translate3d(0,-300px,0)'});
                this.dialog.animate({
                    'transform': 'translate3d(0,0,0)',
                    '-webkit-transform': 'translate3d(0,0,0)',
                    'opacity': 1,
                }, 300, 'ease');
                break;
            case 'rotate':
                this.dialog.show();
                this.dialog.wrap('<div class="ui-dialog-wrap"></div>');
                this.dialog.css({'transform': 'rotateY(-390deg)','-webkit-transform': 'rotateY(-390deg)'});
                this.dialog.animate({
                    'transform': 'rotateY(0deg)',
                    '-webkit-transform': 'rotateY(0deg)',
                }, 500, 'ease');
                break;
            case 'scale':
                this.dialog.show();
                this.dialog.css({'transform': 'scale(0)','-webkit-transform':'scale(0)'});
                this.dialog.animate({
                    'transform': 'scale(1)',
                    '-webkit-transform': 'scale(1)',
                }, 200, 'ease', function() {

                });
                break;
            case 'fadein':
                this.dialog.show();
                this.dialog.css('opacity', 0);
                this.dialog.animate({
                    opacity: 1,
                }, 400, 'ease', function() {

                });
                break;
            default:
                this.dialog.show();
                $bg.show();
                $bg.animate({
                    opacity: 0.5,
                }, 500, 'ease');
                break;
        }

    },
    _bindEvent: function() {
        //事件绑定，可以封装到一个方法里
        var self = this,
                $cancel = $('.ui-dialog-btn .ui-dialog-cancel,.ui-dialog .ui-dialog-close'),
                $ok = $('.ui-dialog .ui-dialog-ok');
        if ($cancel) {
            $cancel.click(function() {
                self.hide();
                self.settings.cancelCallback();
                return false;
            });
        }
        if ($ok) {
            $ok.click(function() {
                var call = true;
                if (typeof (self.settings.okCallback) === "function") {
                    call = self.settings.okCallback();
                }
                if (call !== false) {
                    self.hide();
                }
                return true;
            });
        }
        $(document).on('touchmove', '.ui-dialog,.ui-bg', function(e) {
            e.preventDefault();
        });
    },
    _culculate: function() {
        var self = this;
        self.windowHeight = $(window).height();
        self.windowWidth = 320;
        self.dialog.show();
        self.height = self.dialog.height();
        self.dialog.hide();
    },
    //设置弹出框居中 
    _setFlag: function() {
        var scrollTop = 0,boxTop = 0,boxLeft = 0;
        this.dialog.width(this.settings.width);
        scrollTop = $(window).scrollTop();
        boxLeft = (this.windowWidth - this.settings.width) / 2;
        console.log(this.windowHeight)
        boxTop = (this.windowHeight - this.height) / 2 + scrollTop;
        this.dialog.css({'left': boxLeft + 'px', 'top': boxTop + 'px'});
    },
    //弹出框关闭 
    hide: function() {
        $('.ui-bg').hide();
        this.dialog.hide();
    }
}

Leyou.widget.DialogObject = DialogObject;
})(window)