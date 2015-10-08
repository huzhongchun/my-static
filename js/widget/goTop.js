/*
* @file 返回顶部组件
* @import zepto.js
*
* @author huzhongchun
* @date 2015/05/08
*
*/

(function(window){
var GotopObject = function(options){
    this.settings = $.extend({
        img:'http://ms0.jmstatic.com/beauty/image/back_top@2x.png',
        whereShow: 100
    },options)
    this.init();
}
GotopObject.prototype = {
    constructor:GotopObject,
    init: function() {
        var self = this;
        if($('#widget-to-top').length<=0){
            $('#scale-wrapper').append('<div id="widget-to-top" style="background: url('+self.settings.img+') left center no-repeat !important;background-size: 45px 45px !important;position: fixed;bottom: 20px;width: 45px;height: 45px;z-index: 200000;right: 10px;display: none;"></div>');
        }
        self.initEvent();
    },
    initEvent: function(){
        var self = this,opt = this.settings;
        var $toTop = $('#widget-to-top');
        $toTop.off('click');
        $toTop.on('click', function(){
            window.scrollTo(0,0);
            $toTop.hide();
        });
        $(window).on('scroll',function(){
            var scrollTop = $(window).scrollTop();
            if(scrollTop > opt.whereShow){
                $toTop.show();
            }else{
                $toTop.hide();
            }
        });
    }
}

    F.addWidget('GotopObject', GotopObject);
})(window)