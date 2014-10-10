/*
 * AA描画領域に関する処理
 */

var AACanvas = function (canvas) {
	var module = {},
		scale = 1.25,
		innerText = canvas.innerText ? "innerText" : "textContent";

	function calcScale (per) {
		return 0.5 + (per / 10);
	}

	module.cfw = 1;
	module.cfh = 1;
	module.WPH = 1.7;

	module.adjustScale = function (video) {
		module.WPH = video.videoWidth / video.videoHeight;

		var width  = 1600 * scale;
		var height = (width / module.WPH | 0) || 1;
		module.cfw = (width / 10) | 0;
		module.cfh = (module.cfw / module.WPH * 0.6) | 0;

		$(canvas).css({
			width: width + 'px',
			height: height + 'px',
			left: -(width >> 1) + 'px'
		});
		module.resize();
	},

	module.applyScale = function (video, rate) {
		scale = calcScale(rate);
		module.adjustScale(video);
	},

	module.draw = function (text) {
		console.log('draw')
		canvas[innerText] = text;
	},

	module.resize = function () {
		var width = parseInt($(canvas).width());
		var height = parseInt($(canvas).height());

		var scale = Math.min(
			$(window).width() * 0.97 / width, 
			($(window).height() * 0.97) / height
		);

		$(canvas).css({
			'-webkit-transform': 'scale(' + scale + ', ' + scale + ')',
			'transform': 'scale(' + scale + ', ' + scale + ')',
			'top': (height - height * scale) / -2 + 'px'
		});
	}

	return module;
}