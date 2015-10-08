/*
* @file 大转盘抽奖组件
* @import zepto.js
*
* @author huzhongchun
* @date 2015/08/20
*
*/

(function(window){
	var turnTableObject = function(id,options){
	    this.settings = $.extend({
	        img: '', //背景转盘的图片地址
            arrowImg: '', //转盘指针的图片地址
            arrowWidth: 0, //指针图片的宽度（用来将指针定位到中央）
            arrowHeight: 0, //指针图片的高度（用来将指针定位到中央）
            arrowTop: 86.25,//指针距离上面大抓盘的高度，实现指针居中的位置
            width: 280, //转盘的宽度
            areaNum: 8, //扇形数目
            random: true, //是否用默认得随机方法
            randomChance: {//默认的随机方法对应奖项和概率
            	//中奖项：中奖概率
                "4": 80,
                "5": 20,
            },
            prizeArea: {  //中奖的规格，可能出现的中奖情况
                '1': {
                    'area': [1,3],
                    'message': '满100减10现金券'
                },
                '2': {
                    'area': [2,5],
                    'message': '满300减40现金券'
                },
                '3': {
                    'area': [4, 7],
                    'message': '满500减70现金券'
                },
                '4': {
                    'area': [6],
                    'message': '谢谢参与',
                },
                '5': {
                    'area': [8],
                    'message': 'iPhone 7 一台',
                },
            }, 
            //中奖的区域范围，按照逆时针数，数组得0为第一个中奖得位置
            success: function() {
                alert('已完成');
            }
	    },options)
		this.element =  document.getElementById(id);
	    this.init();
	}

	turnTableObject.prototype={
		constructor:turnTableObject,
		rotate: 0,
	    sign: 0,
	    prizeMessage: '',
		init:function(){
			this.template = '<div class="turntable-area" style="position:relative;margin:0px auto;">' +
								'<img class="turntable-arrow turntable-btn" style="position: absolute;z-index: 2;" src="<%=arrowImg%>">' +
								'<img class="turntable-img" src="<%=img%>"/>' +
							'</div>';
			var opts = this.settings;
	        var turntableHtml = this.parseTpl(this.template, opts);
	        $(this.element).append(turntableHtml);
	        $('.turntable-arrow').css({'width': opts.arrowWidth / 2, 'top': opts.arrowTop, 'left': (opts.width - opts.arrowWidth/2) / 2});
	        $('.turntable-img').css('width', opts.width);
	        this.initEvent();
		},
		parseTpl:function(str, data) {
		    var tmpl = 'var __p=[];' + 'with(obj||{}){__p.push(\'' +
		            str.replace(/\\/g, '\\\\')
		            .replace(/'/g, '\\\'')
		            .replace(/<%=([\s\S]+?)%>/g, function(match, code) {
		                return '\',' + code.replace(/\\'/, '\'') + ',\'';
		            })
		            .replace(/<%([\s\S]+?)%>/g, function(match, code) {
		                return '\');' + code.replace(/\\'/, '\'')
		                        .replace(/[\r\n\t]/g, ' ') + '__p.push(\'';
		            })
		            .replace(/\r/g, '\\r')
		            .replace(/\n/g, '\\n')
		            .replace(/\t/g, '\\t') +
		            '\');}return __p.join("");',
		            /* jsbint evil:true */
		            func = new Function('obj', tmpl);
		    return data ? func(data) : func;
		},
		getRand: function(proArr) {
	        var result = '';
	        //概率数组的总概率精度
	        var proSum = 0;
	        for (var i in proArr) {
	            proSum += proArr[i];
	        }
	        for (var j in proArr) {
	            var randNum = Math.random() * proSum;
	            if (randNum <= proArr[j]) {
	                result = j;
	                break;
	            } else {
	                proSum -= proArr[j];
	            }
	        }
	        return result;
	    },
	    initEvent: function() {
	        var self = this;

	        var opts = self.settings;
	        if (opts.random) {
	            $('.turntable-btn').on('tap', function() {
	                var sign = self.getRand(opts.randomChance);
	                self.startRotate(sign);
	            });
	        }
	        $('.turntable-img').off('webkitTransitionEnd');
	        $('.turntable-img').on('webkitTransitionEnd', function() {
	            $('.turntable-btn').css("pointer-events", 'all');
	            //this.style.removeProperty('-webkit-transition');
	            this.style.webkitTransition = '-webkit-transform 0ms ease-in-out';
	            this.style.webkitTransform = 'rotateZ(' + self.rotate + 'deg)';
	            try {
	                //self.args.push(opts.prizeArea[self.sign].message);
	                opts.success.apply(self, self.args);
	            } catch (e) {
	                opts.success.apply(self, [self.sign, '没有中奖信息']);
	            }
	        });
	    },
	    startRotate: function(sign) {
	        var opts = this.settings;
	        var self = this;
	        self.sign = sign;
	        self.args = [].slice.call(arguments);
	        var prize = opts.prizeArea[sign].area, area;
	        if (prize.length > 1) {
	            area = prize[Math.floor(Math.random() * prize.length)];
	        } else {
	            area = prize[0];
	        }

	        var single = 360 / opts.areaNum;
	        var randomAngle = single * Math.random();
	        if (randomAngle <= 10) {
	            randomAngle = randomAngle + 10;
	        } else if ((single - randomAngle) <= 10) {
	            randomAngle = randomAngle - 10;
	        }
	        var rotate = self.rotate = Math.floor((area - 1) * (single) + randomAngle);

	        var $turntable = $('.turntable-img'), $turnBtn = $('.turntable-btn');
	        if ($turnBtn.css('pointer-events') != "none") {
	            $turntable.css("pointer-events", 'none');
	            $turnBtn.css("pointer-events", 'none');
	            $turntable[0].style.webkitTransition = '-webkit-transform 6s ease-in-out';
	            $turntable[0].style.webkitTransform = 'rotateZ(' + (3240 + rotate) + 'deg)';
	        }
	    }

	}

    F.addWidget('turnTableObject', turnTableObject);

})(window)