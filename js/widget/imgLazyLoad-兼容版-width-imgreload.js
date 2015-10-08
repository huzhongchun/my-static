
/**
 * @date 2015-08-21
 * @author huzhongchun
 * @name 兼容版图片延迟加载，单个图片加载失败可点击重新加载
 * @desc 图片延迟加载,无动画效果，可选加载占位效果
 *
 * **Options**
 * - ''placeHolder''     {String}:              (可选, 默认值:\'\')图片显示前的占位符
 * - ''container''       {Array|Selector}:      (可选, 默认值:window)图片延迟加载容器，若innerScroll为true，则传外层wrapper容器即可
 * - ''threshold''       {Array|Selector}:      (可选, 默认值:0)阀值，为正值则提前加载
 * - ''urlName''         {String}:              (可选, 默认值:data-url)图片url名称
 * - ''eventName''       {String}:              (可选, 默认值:scrollStop)绑定事件方式
 * - --''refresh''--     {Boolean}              --(可选, 默认值:false)是否是更新操作，若是页面追加图片，可以将该参数设为true--（该参数已经删除，无需使用该参数，可以同样为追加的图片增加延迟加载）
 * - ''innerScroll''     {Boolean}              (可选, 默认值:false)是否是内滚，若内滚，则不绑定eventName事件，用户需在外部绑定相应的事件
 * - ''isVertical''      {Boolean}              (可选, 默认值:true)是否竖滚
 *
 * **events**
 * - ''startload'' 开始加载图片
 * - ''loadcomplete'' 加载完成
 * - ''error'' 加载失败
 */

(function(window,undefined){
    var imgLazyObject = function(options){
        this.settings = $.extend({
            threshold: 0,
            container: window,
            urlName: 'data-url',
            placeHolder: '',
            eventName: 'scrollStop',
            innerScroll: false,
            isVertical: true,
            classSelector: 'img',
            reloadTipImg: '',
        },options);
        this.pedding = [];
        this.init();
    }
    imgLazyObject.prototype = {
        contructor:imgLazyObject,
        init: function(){
            var opt = this.settings;
            //占位图片预加载
            if(opt.placeHolder.length > 0){
                var img1 = new Image();
                img1.src = opt.placeHolder;
            }
            if(opt.reloadTipImg.length > 0){
                var img2 = new Image();
                img2.src = opt.reloadTipImg;
            }
            this.initElem();
            this.initEvent();
        },
        initElem: function() {
            var opt = this.settings,self = this,element = null;
                //把元素push到pedding
                element = opt.classSelector.length > 0 ? opt.classSelector : 'img';
                $(element).each(function() {
                    var attr = $(this).attr(opt.urlName);
                    if( attr && attr.length > 0 ){
                        self.pedding.push(this);
                        if (opt.placeHolder.length > 0) {
                            
                            $(this).attr('src', opt.placeHolder);
                        }
                    }
                });
        },
        lazyLoadPic: function (){
            var _winHeight = $(window).height();
            var self = this,opts = this.settings;
            var _winScrollTop = $(window).scrollTop();
            var list = self.pedding,_offsetTop =null;
            for (var i = 0; i < list.length; i++) {
                list[i]
                var $self = $(list[i]);
                // 如果是img
                if($self.is('img')){
                    if($self.attr('data-url')){
                        _offsetTop = $self.offset().top;
                        if((_offsetTop - opts.threshold) <= (_winHeight + _winScrollTop)){
                            self.detect();
                        }
                    }
                    // 如果是背景图
                }else{
                    if($self.attr('data-url')){
                        // 默认占位图片
                        if($self.css('background-image') == 'none'){
                            $self.css('background-image','url('+opts.placeholder+')');
                        }
                        _offsetTop = $self.offset().top;
                        if((_offsetTop - opts.threshold) <= (_winHeight + _winScrollTop)){
                            $self.css('background-image','url('+$self.attr('data-url')+')');
                            $self.removeAttr('data-url');
                        }
                    }
                }
            }
        },
        initEvent: function() {
            var self = this,opt = this.settings;
            $(function() {
                self.detect();
                setTimeout(function() {
                    self.detect();
                }, 500);
            });
            //滚动结束后触发,部分机型触发不太好
            // $(window).on(opt.eventName + ' ortchange', function() {    //不是内滚时，在window上绑定事件
            //     if (self.pedding.length <= 0) {
            //         $(window).off(opt.eventName + ' ortchange');
            //     } else {
            //         self.detect();
            //     }
            // });

            //scroll监听，兼容部分对scrollStop事件支持不太好的设备
            $(window).on('scroll',function(){
                //_winScrollTop = $(window).scrollTop();
                self.lazyLoadPic();
            });
        },
        load: function(div) {
            var $div = $(div),attrObj = {},$img = $div,self = this,opt = this.settings,isImg = $(div).is('img'),attrName = '';
            if (!isImg) {
                $.each($div.get(0).attributes, function() {   //若不是img作为容器，则将属性名中含有data-的均增加到图片上
                    ~this.name.indexOf('data-') && (attrObj[this.name] = this.value);
                });
                $img = $('<img />').attr(attrObj);
            }
            attrName = $div.attr(opt.urlName);
            var loadFunc = function(url){
                var tempImg = new Image();
                tempImg.src = url ;
                tempImg.onload = function(){
                    if (attrName && attrName !== '') {
                        $img.attr('src', attrName);
                        $img.css({'opacity': 1});
                    }
                    $img.off('click');
                }
                tempImg.onerror = function(){
                    /*加载错误则移除，防止出现错误图片的框*/
                    //$img.off('error').remove();
                    $img.attr('src', opt.reloadTipImg);
                    var temp = attrName;
                    $img.off('click');
                    $img.on('click',function(e){  //如果加载失败，则点击重新加载！
                        e.preventDefault();
                        e.stopPropagation();
                        $(this).attr('src', opt.placeHolder);
                        loadFunc(temp);
                    })
                }
            }
            
            loadFunc(attrName);
        },
        detect: function() {
            var i,
            $image,
            offset,
            div,
            self = this,
            splice = [].splice;
            for (i = self.pedding.length; i--; ) {
                $image = $(div = self.pedding[i]);
                offset = $image.offset();
                $(div).css({'-webkit-transition': 'all 350ms ease'});
                self.isShow(offset) && (splice.call(self.pedding, i, 1), self.load(div));
            }
        },
        isShow: function(offset) {
            var self = this,opt = this.settings;
            var $wrapper = $(opt.container),
                isVertical = opt.isVertical,
                isWindow = $.isWindow($wrapper.get(0)),
                OFFSET = {
                    win: [isVertical ? 'scrollY' : 'scrollX', isVertical ? 'innerHeight' : 'innerWidth'],
                    img: [isVertical ? 'top' : 'left', isVertical ? 'height' : 'width']
                },
                viewOffset = isWindow ? window : $wrapper.offset(),
                viewTop = viewOffset[OFFSET.win[0]],
                viewHeight = viewOffset[OFFSET.win[1]],
                flag = true;
            if (viewTop >= (offset[OFFSET.img[0]] - opt.threshold - viewHeight) && viewTop <= (offset[OFFSET.img[0]] + offset[OFFSET.img[1]])) {
                flag = true;
            } else {
                flag = false;
            }
            return flag;
        },
    }

    F.addWidget('imgLazyObject', imgLazyObject);
})(window);
