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