!function(t){var e=function(t){this.settings=$.extend({diffDistance:40},t)};e.prototype={constructor:e,slideUp:function(e,o){if(o>e)for(var n=500;n>=0;n-=5)!function(){var f=n;setTimeout(function(){0>=f?t.scrollTo(0,e):t.scrollTo(0,o-f/500*(o-e))},f)}();else for(var f=0;500>=f;f+=5)!function(){var n=f;setTimeout(function(){t.scrollTo(0,o+n/500*(e-o))},n)}()},fireScroll:function(e){var o=this,n=this.settings,f=o.getOffsetPositon(document.getElementById(e)).top,i=0;i=null==n.height?$(o.element).height():n.height,f=(f-i)*Leyou.scale;var s=0;s=$(t).scrollTop(),s*=Leyou.scale,o.slideUp(f,s)},getOffsetPositon:function(t){for(var e=0,o=0,n=t;n.offsetParent;)e+=n.offsetLeft,o+=n.offsetTop,n=n.offsetParent;return{left:e,top:o}}},Leyou.widget.AnchorscrollObject=e}(window);