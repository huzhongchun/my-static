/*
 *@Date 2015/6/23
 *@Author huzhongchun 
 *@File pc分页组件
*/

//初始化
;(function(window,undefined){
	var fenyeObject = function(options){
		this.settings = $.extend({
			showLength: 10,
			defaultPosition: 0,
		},options);
		this.init();
	}
	fenyeObject.prototype = {
		constructor: fenyeObject,
		init: function(){
			var self = this,opt = this.settings;
			this.list = $('.pages-list .page-item');

			this.showHideEllipsis(opt.defaultPosition,this.list);
			this.changeState(opt.defaultPosition,this.list);
			this.addListennerFunc();
		},
		changeState : function(index,list){
			var maxlength = list.length - 1;
			$('.pages-list .curent').removeClass('curent');
			$('.pages-box .end').removeClass('end');
			if(index === 0){
				$('.pages-box  #prev').addClass('end');
			}
			else if(index === maxlength){
				$('.pages-box  #next').addClass('end');
			}
			$(list[index]).addClass('curent');
		},
		//省略号显示或者隐藏
 		showHideEllipsis : function(index,list){
 			var maxlength = list.length - 1,j,k,i;
			var tempM = Math.ceil(maxlength / 10),len = index;
			if( tempM > 1){
				if(index < 9){
					$('.pages-box .dots-left').hide();
					$('.pages-box .dots-right').show();
					for (j = 10; j <= maxlength; j++) {
						$(list[j]).hide();	
					}
					for (k = 9; k >= 0; k--) {
						$(list[k]).show();	
					}
				}
				else if( maxlength - 10 < index && index <= maxlength){
					$('.pages-box .dots-left').show();
					$('.pages-box .dots-right').hide();
					for (i = maxlength - 9; i >= 0; i--) {
						$(list[i]).hide();	
					}
					for (k = maxlength - 9; k <= maxlength; k++) {
						$(list[k]).show();	
					}
				}
				else{
					$('.pages-box .dots-left').show();
					$('.pages-box .dots-right').show();
					for (i = len - 5; i > -1 ; i--) {
						$(list[i]).hide();	
					}
					for (k = len - 4; k < len + 5; k++) {
						$(list[k]).show();	
					}
					for (j = len + 5; j <= maxlength; j++) {
						$(list[j]).hide();	
					}
				}
			}
		},
		//事件绑定
		addListennerFunc: function(){
			var self = this,opt = this.settings;
			var listLength = self.list.length - 1;
			$('#prev').click(function(){
				var curIndex = $('.pages-list .curent').index();
				var prevIndex = curIndex - 1;
				if(prevIndex >= 0){
					self.changeState(prevIndex,self.list);
					self.showHideEllipsis(prevIndex,self.list);
				}
			})
			$('#next').click(function(){
				var curIndex = $('.pages-list .curent').index();
				var nextIndex = curIndex + 1;
				if(nextIndex <= listLength){
					self.changeState(nextIndex,self.list);
					self.showHideEllipsis(nextIndex,self.list);
				}
			})
			$('.pages-list .page-item').click(function(){
				var curIndex = $(this).index();
				self.changeState(curIndex,self.list);
				self.showHideEllipsis(curIndex,self.list);
			})
			
			$('.pages-box .submit-btn').click(function(){
				var targetPage = $('.target-page input').val();
				if(targetPage < 1 || targetPage > listLength + 1){
					alert('请输入范围内的页码');
				}
				else{
					self.changeState(targetPage -1,self.list);
					self.showHideEllipsis(targetPage -1,self.list);
				}
			})
		}
	}


	window.fenyeObject = fenyeObject;
})(window)
// var list = $('.pages-list .page-item'),listLength = list.length -1;
// var init = function(){
// 	showHideEllipsis(0,listLength);
// 	changeState(0);
// 	addListennerFunc();
// }
// //改变当前的页面状态
// var changeState = function(index){
// 	$('.pages-list .curent').removeClass('curent');
// 	$('.pages-box .end').removeClass('end');
// 	if(index === 0){
// 		$('#prev').addClass('end');
// 	}
// 	else if(index === listLength){
// 		$('#next').addClass('end');
// 	}
// 	$(list[index]).addClass('curent');
// }
// //省略号显示或者隐藏
// var showHideEllipsis = function(index,maxlength){
// 	var tempM = Math.ceil(maxlength / 10),len = index;
// 	if( tempM > 1){
// 		if(index < 9){
// 			$('.pages-box .dots-left').hide();
// 			$('.pages-box .dots-right').show();
// 			for (var j = 10; j <= listLength; j++) {
// 				$(list[j]).hide();	
// 			}
// 			for (var k = 9; k >= 0; k--) {
// 				$(list[k]).show();	
// 			};
// 		}
// 		else if( maxlength - 10 < index && index <= maxlength){
// 			$('.pages-box .dots-left').show();
// 			$('.pages-box .dots-right').hide();
// 			for (var i = maxlength - 9; i >= 0; i--) {
// 				$(list[i]).hide();	
// 			};
// 			for (var k = maxlength - 9; k <= maxlength; k++) {
// 				$(list[k]).show();	
// 			};
// 		}
// 		else{
// 			$('.pages-box .dots-left').show();
// 			$('.pages-box .dots-right').show();
// 			for (var i = len - 5; i > -1 ; i--) {
// 				$(list[i]).hide();	
// 			}
// 			for (var k = len - 4; k < len + 5; k++) {
// 				$(list[k]).show();	
// 			};
// 			for (var j = len + 5; j <= listLength; j++) {
// 				$(list[j]).hide();	
// 			};
// 		}
// 	}
// }
// //事件绑定
// var addListennerFunc = function(){

// 	$('#prev').click(function(){
// 		var curIndex = $('.pages-list .curent').index();
// 		var prevIndex = curIndex - 1;
// 		if(prevIndex >= 0){
// 			changeState(prevIndex);
// 			showHideEllipsis(prevIndex,listLength);
// 		}
// 	})
// 	$('#next').click(function(){
// 		var curIndex = $('.pages-list .curent').index();
// 		var nextIndex = curIndex + 1;
// 		if(nextIndex <= listLength){
// 			changeState(nextIndex);
// 			showHideEllipsis(nextIndex,listLength);
// 		}
// 	})
// 	$('.pages-list .page-item').click(function(){
// 		var curIndex = $(this).index();
// 		changeState(curIndex);
// 		showHideEllipsis(curIndex,listLength);
// 	})
	
// 	$('.pages-box .submit-btn').click(function(){
// 		var targetPage = $('.target-page input').val();
// 		if(targetPage < 1 || targetPage > listLength + 1){
// 			alert('请输入范围内的页码');
// 		}
// 		else{
// 			changeState(targetPage -1);
// 			showHideEllipsis(targetPage -1,listLength);
// 		}
// 	})
// }
	
// init();