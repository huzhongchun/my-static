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