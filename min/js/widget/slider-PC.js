!function(t,e){var i=function(t,i){var n=this;i=i||{},n.data={dom:$("#"+t.replace(/^#/,"")),index:i.index||0,imgInit:i.imgInit||2,autoPlay:i.autoPlay||!1,switchTime:i.switchTime||3e3,animateTime:i.animateTime||400,dotsClass:i.dotsClass||"slider-dots",dotsSelectedId:i.dotsSelectedId||"slider-dot-select",showDot:i.showDot!==e?i.showDot:!0,slideEnd:i.slideEnd||null,slideStart:i.slideStart||null,_needPlay:!0,_direction:i.direction!==e?i.direction:1,_jumpFlagOrigin:!1},n.init(),n.start()};i.prototype={constructor:i,moveFlag:!1,transitionEndFlag:!0,init:function(){var t=this,e=t.data;e.moveDirection=1==e._direction?"right":"left",t.doubleChildren(),e.dom.addClass("slider");for(var i,n,d=e.dom[0].offsetWidth,a=(e.dom[0].offsetHeight,e.dom.children()),l=$("<div></div>"),o=$(l).clone(),s=$("<b></b>"),r=[],c=0,h=a.length;c<a.length;c++)i=$(a[c]).clone(!0),$(i).addClass("slider-item"),$(i).css("width",d+"px"),$(l).append(i),$(l).addClass("slide-wrapper clearfloat"),n=$(i).find("img")[0],c<e.imgInit?n&&!n.src&&n.getAttribute("lazyload")&&(n.src=n.getAttribute("lazyload")):r.push(n);for(var u=0;u<=e.Maxlen;u++)$(o).append(s.clone());$(l).css({position:"relative",left:"-"+e.index*d+"px",width:d*h+"px"}),$(o).addClass(e.dotsClass),e.showDot||$(o).hide(),e.dom.html("").append($(l)),e.dom.append(o),e.wheel=l,e.items=l.children(),e.length=e.items.length,1==e.length&&o.hide(),e.dots=o.children(),e.dots.length>0&&$(e.dots[e.index-e.Prevlen-1]).addClass(e.dotsSelectedId),e.width=d,e.lazyImgs=r},doubleChildren:function(){var t,e=this,i=e.data,n=i.dom.children().length-1,d=parseInt(n/2);e.data.Maxlen=n,e.data.Prevlen=d,e.data.Lastlen=n+d+1,e.data.index=d+1;for(var a=i.dom.children(),l=0;d>l;l++)t=$(a[l]).clone(!0),i.dom.append(t);for(var o=n;o>=n-d;o--)t=$(a[o]).clone(!0),$(t).insertBefore(i.dom.children().first())},changeCurentPosition:function(){var t=this,e=t.data;e.index<=e.Prevlen&&"right"==e.moveDirection?(e.index=e.index+e.Maxlen+1,$(e.wheel).css({position:"relative",left:"-"+e.index*e.width+"px"})):e.index>=e.Lastlen+1&&"left"==e.moveDirection&&(e.index=e.index-(e.Maxlen+1),$(e.wheel).css({position:"relative",left:"-"+e.index*e.width+"px"}))},_jugeDirection:function(){var t=this,e=t.data;e.curIndex-e.index<0?e.moveDirection="left":e.curIndex-e.index>0&&(e.moveDirection="right"),t.changeCurentPosition()},_slide:function(t,e,i){{var n=this,d=n.data;d.length}return n._move(t,i),n.data.slideStart&&n.data.slideStart.apply(n),n},_move:function(t){{var e=this.data,i=this;e.index}if(i.transitionEndFlag=!1,e.lazyImgs.length){var n=$(e.items[t]).find("img")[0];n&&!$(n).attr("src")&&(n.src=$(n).attr("lazyload"))}e.index=t,e.wheel.animate({left:"-"+t*e.width+"px"},e.animateTime,"easeInOutExpo",function(){i.moveFlag=!1,i._jugeDirection(),e.showDot&&($("."+e.dotsSelectedId).removeClass(e.dotsSelectedId),$(e.dots[e.index-e.Prevlen-1]).addClass(e.dotsSelectedId)),i._setTimeout(),i.data.slideEnd&&i.data.slideEnd.apply(i),i.transitionEndFlag=!0})},_closeCallFlag:function(){this.data._jumpFlagOrigin=!1},_openCallFlag:function(){this.data._jumpFlagOrigin=!0},_setTimeout:function(){var t=this,e=t.data;return e._needPlay&&e.autoPlay?(clearTimeout(e.play),e.play=setTimeout(function(){e.curIndex=e.index,t._slide.call(t,e.index+e._direction,!0)},e.switchTime),t):t},start:function(){var t=this;return t.data._needPlay=!0,t._setTimeout(),t},stop:function(){var t=this;return clearTimeout(t.data.play),t.data._needPlay=!1,t},prev:function(){var t=this,e=t.data;return e.curIndex=e.index,t.transitionEndFlag?this._slide(this.data.index-1,!1):void 0},next:function(){var t=this,e=t.data;return e.curIndex=e.index,t.transitionEndFlag?this._slide(this.data.index+1,!1):void 0},moveTo:function(t){var e=this,i=e.data,n=t+i.Prevlen+1;return e.transitionEndFlag&&e.transitionEndFlag?this._slide(n,!1):void 0}},t.Slider=i}(window);