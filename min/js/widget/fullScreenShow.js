!function(e){function a(e){var a=function(){};this.options=$.extend({id:"full-screen-container",index:0,isShowTips:!0,tipsMessages:"向上滑动",backMaxLength:100,animateTime:.4,animateEndCallback:a},e),this.init()}a.prototype={init:function(){var a=this,i=this.options,n=$(e).height();i.direction=null,a.page={},a.$dom=$("#"+i.id),a.$dom.css({width:"100%",height:n,position:"relative",overflow:"hidden"});var t=a.$dom.children();t.css({position:"absolute",width:"100%",height:"100%",overflow:"hidden",left:0,top:0});var s=t.length;if(t.addClass("hide"),$(t[i.index]).addClass("active").removeClass("hide"),i.isShowTips){var o='<div class="tips">'+i.tipsMessages+"</div>";$("#wrapper").append(o),setTimeout(function(){var e=$(".tips").width();$(".tips").css("left",160-e/2+"px")},100)}a.$dom.on("touchstart",function(e){e.preventDefault(),a.page.startY=e.touches[0].pageY,a.page.movedY=0;var o=a.getTranslateArray();a.page.currentY=parseInt(o[1]),i.index=$(".active").index(),i.index!=s-1&&$(t[i.index+1]).addClass("z-index-high").removeClass("hide").css({"-webkit-transform":"translate3d(0px, "+n+"px, 0px)",transition:"all 0s ease 0s"}),0!==i.index&&$(t[i.index-1]).addClass("z-index-high").removeClass("hide").css({"-webkit-transform":"translate3d(0px, "+-n+"px, 0px)",transition:"all 0s ease 0s"})}),a.$dom.on("touchmove",function(e){e.preventDefault(),a.page.endY=e.touches[0].pageY,a.page.movedY=a.page.endY-a.page.startY,i.direction||(i.direction=a.page.movedY>0?"down":"up"),"down"==i.direction?0!==i.index&&$(t[i.index-1]).css("-webkit-transform","translate3d(0px, "+(-n+a.page.movedY)+"px, 0px)"):i.index!=s-1&&$(t[i.index+1]).css("-webkit-transform","translate3d(0px, "+(n+a.page.movedY)+"px, 0px)")}),a.$dom.on("touchend touchcancel",function(){var e=a.getTranslateArray();a.page.touchEndY=parseInt(e[1]),"down"==i.direction?0!==a.page.movedY&&0!==i.index&&(a.page.movedY>i.backMaxLength?($(t[i.index-1]).addClass("active").removeClass("z-index-high").css({"-webkit-transform":"translate3d(0px, 0px, 0px)",transition:"all "+i.animateTime+"s ease 0s"}),$(t[i.index]).removeClass("active"),t.off("webkitTransitionEnd"),$(t[i.index-1]).on("webkitTransitionEnd",function(e){if("transform"==e.propertyName){var n=i.index-1;i.animateEndCallback.call(a,n)}})):$(t[i.index-1]).css({"-webkit-transform":"translate3d(0px, "+-n+"px, 0px)",transition:"all "+i.animateTime+"s ease 0s"})):0!==a.page.movedY&&i.index!=s-1&&(a.page.movedY>-i.backMaxLength?$(t[i.index+1]).css({"-webkit-transform":"translate3d(0px, "+n+"px, 0px)",transition:"all "+i.animateTime+"s ease 0s"}):($(t[i.index]).removeClass("active"),$(t[i.index+1]).addClass("active").removeClass("z-index-high").css({"-webkit-transform":"translate3d(0px, 0px, 0px)",transition:"all "+i.animateTime+"s ease 0s"}),t.off("webkitTransitionEnd"),$(t[i.index+1]).on("webkitTransitionEnd",function(e){if("transform"==e.propertyName){var n=i.index+1;i.animateEndCallback.call(a,n)}}))),i.direction=null})},getTranslateArray:function(){var e,a=(this.options,$("#full-screen-container")),i=a.css("-webkit-transform");return e=i.indexOf("matrix")>-1||"none"==i?["0","0","0"]:$.trim(i).match(/-?\d*?.?\d*px/g)}},Leyou.widget.fullScreenShowObject=a}(window);