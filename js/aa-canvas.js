/**
 * AA描画領域に関する処理
 * @param {HTMLElement} canvas
 */
var AACanvas = function (canvas) {
	var module = {},
		scale = 1.25,
		innerText = canvas.innerText ? "innerText" : "textContent";

	/**
	 * InputValueの値をScale用に加工
	 * @param  {Number} rate
	 */
	function calcScale (rate) {
		return 0.5 + (rate / 10);
	}


	/**
	 * AAの横の文字数
	 * @type {Number}
	 */
	module.cfw = 1;


	/**
	 * AAの縦の文字数
	 * @type {Number}
	 */
	module.cfh = 1;


	/**
	 * アスペクト比
	 * @type {Number}
	 */
	module.WPH = 1.7;


	/**
	 * メディアの解像度を元にCanvasの位置・大きさを調整
	 * @param  {HTMLVideoElement} source
	 */
	module.adjustScale = function (source) {
		module.WPH = source.videoWidth / source.videoHeight;

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
	};


	/**
	 * 指定された解像度を適用する
	 * @param  {HTMLVideoElement} source
	 * @param  {Number} rate
	 */
	module.applyScale = function (source, rate) {
		scale = calcScale(rate);
		module.adjustScale(source);
	};


	/**
	 * AAを描画
	 * @param  {String} text
	 */
	module.draw = function (text) {
		canvas[innerText] = text;
	};


	/**
	 * Canvasが画面いっぱいになるようScaleを調整する
	 * @return {[type]}
	 */
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
	};

	return module;
}