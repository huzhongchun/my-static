!function(t){var e=function(t){var e=function(){};this.settings=$.extend({id:"scroll-box",pullDownCallback:e,pullUpCallback:e,startPullDownCallback:e,startPullDownMaxLength:40},t),this.init()};e.prototype={constructor:e,init:function(){var t=this,e=this.settings;if(t.time={},t.pageXY={},t.speed=0,t.direction=null,t.parentHeight=0,!e.id||!$("#"+e.id))return console.log("id或dom为null!"),!1;t.dom=$("#"+e.id);var n=$(this.dom).parent();n.css("overflow","hidden"),t.addListener()},addListener:function(){var t=this,e=this.settings,n=t.pageXY;t.touchendFlag=!0;var a=$(t.dom);a.on("touchstart",function(e){t.time.startT=(new Date).getTime(),n.startX=e.touches[0].pageX,n.startY=e.touches[0].pageY;var a=t.getTranslateArray();n.currentX=parseInt(a[0]),n.currentY=parseInt(a[1]),t.stopMoveByCss(n.currentX),t.maxMove=t.getMaxMove()}),a.on("touchmove",function(s){s.preventDefault(),n.endX=s.touches[0].pageX,n.endY=s.touches[0].pageY,n.movedX=n.endX-n.startX,n.movedY=n.endY-n.startY,t.direction=n.movedX>0?"right":"left",n.targetX=n.currentX+n.movedX,n.targetY=n.currentY+n.movedY,n.currentX<="0"&&n.targetX>0&&t.touchendFlag&&(e.startPullDownCallback(),t.touchendFlag=!1),n.currentX<=e.startPullDownMaxLength&&n.targetX>e.startPullDownMaxLength&&t.maxMove>0?a.css("-webkit-transform","translate3d( 40px, 0px,0px)"):t.maxMove>0&&(n.targetX<-(t.maxMove+e.startPullDownMaxLength)?a.css("-webkit-transform","translate3d("+-(e.startPullDownMaxLength+t.maxMove)+"px,0px,  0px)"):a.css("-webkit-transform","translate3d("+n.targetX+"px,0px, 0px)"))}),a.on("touchend",function(){var a,s,o;t.touchendFlag=!0;var r=t.getTranslateArray();n.touchEndX=parseInt(r[0]),n.touchEndY=parseInt(r[1]),t.time.endT=(new Date).getTime(),t.time.moveingT=t.time.endT-t.time.startT,n.moveLen=n.touchEndX-n.currentX,t.speed=Math.abs(n.moveLen/t.time.moveingT),a=t.time.moveingT/200,s=500*t.speed>5?500*t.speed:0,o="left"===t.direction?n.touchEndX-s:n.touchEndX+s,o>=e.startPullDownMaxLength&&(o=e.startPullDownMaxLength),o<-(t.maxMove+e.startPullDownMaxLength)&&(o=-(t.maxMove+e.startPullDownMaxLength)),t.moveByCss(a,o),t.monitor()})},getTranslateArray:function(){var e,n=$(this.dom),a=t.getComputedStyle(n[0])["-webkit-transform"].split(")")[0].split(", ");return e="none"===a[0]?["0","0","0"]:[a[12]||a[4],a[13]||a[5],"0"]},stopMoveByCss:function(t){var e=$(this.dom);e.css({"-webkit-transition":"-webkit-transform 0s ease-out 0s",transition:"-webkit-transform 0s ease-out 0s"}),e.css("-webkit-transform","translate3d("+t+"px, 0px, 0px)")},moveByCss:function(t,e){var n=(this.settings,$(this.dom));n.css({"-webkit-transition":"-webkit-transform "+t+"s cubic-bezier(0.333333,0.666667,0.66667,1) 0s",transition:"-webkit-transform "+t+"s cubic-bezier(0.333333,0.666667,0.66667,1) 0s"}),n.css("-webkit-transform","translate3d("+e+"px, 0px, 0px)")},offset:function(t){for(var e=0,n=0,a=t;a.offsetParent;)e+=a.offsetLeft,n+=a.offsetTop,a=a.offsetParent;return{left:e,top:n}},getMaxMove:function(){var t=this.settings,e=$("#"+t.id).width(),n=e-$(this.dom).parent().width();return 0>n&&(n=0),n},monitor:function(){var t,e=this,n=this.settings,a=$(this.dom),s=setInterval(function(){var o=e.getTranslateArray(),r=parseInt(o[0]);r>0&&(e.stopMoveByCss(r),e.moveByCss("0.5",0),t=function(){n.pullDownCallback(),a.off("webkitTransitionEnd")},t(),clearInterval(s)),r<-e.maxMove&&(e.stopMoveByCss(r),e.moveByCss("0.5",-e.maxMove),t=function(){n.pullUpCallback(),a.off("webkitTransitionEnd")},t(),clearInterval(s))},100)}},F.addWidget("scrollXObject",e)}(window);