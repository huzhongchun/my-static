/*
* @file 预加载图片判断页面加载进度组件
* @import zepto.js
*
* @author huzhongchun
* @date 2015/05/08
*
*/

(function(window,$){
	var prevLoadObject = function(options){
		this.settings = $.extend({
			picsArray: [],
			loadFinishFunc: function(){}, //加载完成之后的回调
			loadingHandleFunc: function(){},  //加载过程中进度的变化处理函数
		},options);
		this.init();
	}
	prevLoadObject.prototype = {
		constructor: prevLoadObject,
		init: function(){
			this.loadImg(this.picsArray,this.settings.loadFinishFunc)
		},
		loadImg: function(picsArray,callback){
			var self = this,opt = this.settings,scale = null;
			var img = new Image();
            //递归回调，阻塞图片并行加载，变成上一个图片加载完成之后再加载下一个
            var index = 0,len = opt.picsArray.length;
            var load = function(){
                img.src = opt.picsArray[index];
                img.onload = function(){
                    scale = Math.floor((index + 1) * 100 / len) + '%';
                    opt.loadingHandleFunc.call(this,scale);
                    index++;
                    if(index < len){
                        load();
                    }
                    else{
                        //加载完成之后的回调
                        callback.call(this);
                    }
                }
                //如果图片加载失败，则再次请求该图片
                img.onerror = function(){
                    load();
                }
            }
            if(len > 0)
                load();
            else{//如果没有图片
                opt.loadingHandleFunc.call(this,scale);
                callback.call(this);
            }
		}

	}
	
    Leyou.widget.prevLoadObject = prevLoadObject;

})(window,Zepto);