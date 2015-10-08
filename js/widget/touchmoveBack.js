;(function(widnow) {
	function touchmoveBack(callback){
		var touchPosition = {}, bodyWidth = $('body').width();
			$('body').on('touchstart',function(e){
				touchPosition.tStartX = e.touches[0].pageX;
				touchPosition.tStartY = e.touches[0].pageY;
			})
			$('body').on('touchmove',function(e){
				//console.log(e);
			})
			$('body').on('touchend',function(e){
				touchPosition.tEndX = e.changedTouches[0].pageX;
				touchPosition.tEndY = e.changedTouches[0].pageY;

				var disX = Math.abs((touchPosition.tEndX - touchPosition.tStartX) / F.scale);
				var disY = Math.abs((touchPosition.tEndY - touchPosition.tStartY) / F.scale);
				if(disX > bodyWidth / 4 && touchPosition.tStartX <= 10 && disY <= 50){
					callback.call(this,touchPosition);
				}

			})
	}

    F.addWidget('touchmoveBack', touchmoveBack);
})(window)