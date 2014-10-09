/*
 * AA描画領域に関する処理
 */

var AACanvas = function (canvas) {
	this.cfw = 1;
	this.cfh = 1;
	this.WPH = 1.7;
	this._scale = 1.25;
	this._canvas = canvas;
	this.draw = this.draw();
}
AACanvas.prototype = {
	adjustScale: function (video) {
		this.WPH = video.videoWidth / video.videoHeight;

		var width  = 1600 * this._scale;
		var height = (width / this.WPH | 0) || 1;
		this.cfw = (width / 10) | 0;
		this.cfh = (this.cfw / this.WPH * 0.6) | 0;

		$(this._canvas).css({
			width: width + 'px',
			height: height + 'px',
			left: -(width >> 1) + 'px'
		});
		this.resize();
	},

	applyScale: function (video, rate) {
		this._scale = this._calcScale(rate);
		this.adjustScale(video);
	},

	draw: function () {
		var innerText = this._canvas.innerText ? "innerText" : "textContent";

		return function (text) {
			this._canvas[innerText] = text;
		}
	},

	resize: function () {
		var width = parseInt($(this._canvas).width());
		var height = parseInt($(this._canvas).height());

		var scale = Math.min(
			$(window).width() * 0.97 / width, 
			($(window).height() * 0.97) / height
		);

		$(this._canvas).css({
			'-webkit-transform': 'scale(' + scale + ', ' + scale + ')',
			'transform': 'scale(' + scale + ', ' + scale + ')',
			'top': (height - height * scale) / -2 + 'px'
		});
	},

	_calcScale: function (per) {
		return 0.5 + (per / 10);
	}
}