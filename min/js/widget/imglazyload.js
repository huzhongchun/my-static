!function(e){var t=[];$.fn.imglazyload=function(n){function r(t){var n=f?e:s.offset(),r=n[u.win[0]],i=n[u.win[1]];return r>=t[u.img[0]]-c.threshold-i&&r<=t[u.img[0]]+t[u.img[1]]}function i(e){var n=$(e),r={},i=n;g||($.each(n.get(0).attributes,function(){~this.name.indexOf("data-")&&(r[this.name]=this.value)}),i=$("<img />").attr(r)),n.trigger("startload"),i.on("load",function(){i.css({opacity:1}),!g&&n.replaceWith(i),n.trigger("loadcomplete"),i.off("load")}).on("error",function(){var e=$.Event("error");e.defaultPrevented||t.push(n),i.off("error").remove()}).attr("src",n.attr(c.urlName))}function o(){var e,n,o,a;for(e=t.length;e--;)n=$(a=t[e]),o=n.offset(),$(a).css({opacity:0,"-webkit-transition":"all 400ms ease"}),r(o)&&(l.call(t,e,1),i(a))}function a(){!g&&h&&$(t).append(h)}var l=Array.prototype.splice,c=$.extend({threshold:0,container:e,urlName:"data-url",placeHolder:"",eventName:"scrollStop",innerScroll:!1,isVertical:!0},n),s=$(c.container),d=c.isVertical,f=$.isWindow(s.get(0)),u={win:[d?"scrollY":"scrollX",d?"innerHeight":"innerWidth"],img:[d?"top":"left",d?"height":"width"]},h=$(c.placeHolder).length?$(c.placeHolder):null,g=$(this).is("img");return!f&&(u.win=u.img),t=Array.prototype.slice.call($(t.reverse()).add(this),0).reverse(),$.isFunction($.fn.imglazyload.detect)?(a(),this):($(document).ready(function(){a(),o(),setTimeout(function(){o()},500)}),!c.innerScroll&&$(e).on(c.eventName+" ortchange",function(){o()}),$.fn.imglazyload.detect=o,this)}}(window);