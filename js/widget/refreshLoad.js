/*
* @file 底部上拉加载或者刷新组件
* @import zepto.js
*
* @author huzhongchun
* @date 2015/05/08
*
*/
(function(window,$){
    var Refreshload = function(options){
        this.settings = $.extend({
            callback:function(){},
            loadedFlag : true
        },options);
        this.init();
    }
    Refreshload.prototype = {
        constructor:Refreshload,
        init:function(){
            this.initEvent();
        },
        initEvent: function() {
            var self = this,opt = this.settings;
            $(window).on('scroll', function(){
                if(opt.loadedFlag){
                    if($(window).scrollTop() > ($(document).height()-$(window).height()-10)){
                        opt.loadedFlag = false;
                        opt.callback.call(self);
                    }
                }
            });
        },
        changeFlag: function(){
            var self = this;
            self.settings.loadedFlag = true;
        }
    }
    F.addWidget('Refreshload', Refreshload);
})(window,Zepto)