!function(t){var i=function(i){this.settings=$.extend({threshold:0,container:t,urlName:"data-url",eventName:"scrollStop",innerScroll:!1,isVertical:!0,classSelector:"img"},i),this.pedding=[],this.init()};i.prototype={contructor:i,init:function(){this.initElem(),this.initEvent()},initElem:function(){var t=this.settings,i=this,e=null;e=t.classSelector.length>0?t.classSelector:"img",$(e).each(function(){var e=$(this).attr(t.urlName);e&&e.length>0&&i.pedding.push(this)})},initEvent:function(){var i=this,e=this.settings;$(function(){i.detect(),setTimeout(function(){i.detect()},500)}),$(t).on(e.eventName+" ortchange",function(){i.pedding.length<=0?$(t).off(e.eventName+" ortchange"):i.detect()})},load:function(t){var i=$(t),e={},n=i,o=this.settings,s=$(t).is("img"),r="";s||($.each(i.get(0).attributes,function(){~this.name.indexOf("data-")&&(e[this.name]=this.value)}),n=$("<img />").attr(e)),i.trigger("startload"),n.on("load",function(){n.css({opacity:1}),!s&&i.replaceWith(n),i.trigger("loadcomplete"),n.off("load")}).on("error",function(){n.off("error").remove()}),r=i.attr(o.urlName),r&&""!==r&&n.attr("src",r)},detect:function(){var t,i,e,n,o=this,s=[].splice;for(t=o.pedding.length;t--;)i=$(n=o.pedding[t]),e=i.offset(),$(n).css({opacity:0,"-webkit-transition":"all 350ms ease"}),o.isShow(e)&&(s.call(o.pedding,t,1),o.load(n))},isShow:function(i){var e=this.settings,n=$(e.container),o=e.isVertical,s=$.isWindow(n.get(0)),r={win:[o?"scrollY":"scrollX",o?"innerHeight":"innerWidth"],img:[o?"top":"left",o?"height":"width"]},a=s?t:n.offset(),c=a[r.win[0]],l=a[r.win[1]],h=!0;return h=c>=i[r.img[0]]-e.threshold-l&&c<=i[r.img[0]]+i[r.img[1]]?!0:!1}},Leyou.widget.imgLazyObject=i}(window);