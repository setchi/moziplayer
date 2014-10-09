/*
 * AA描画の操作
 */

var AAPlayer = function (AACanvas, VideoSource, AARenderer) {
	this._AACanvas = AACanvas;
	this._AARenderer = AARenderer;
	this._VideoSource = VideoSource;
	this._animationFrame = null,
	this._playing = false;
	this._context = document.getElementById("buffer").getContext("2d");
	this._$currentPosition = $('#currentPosition');

	var _self = this;
	this._VideoSource.addEventListeners({
		timeupdate: function () {
			if (_self._VideoSource.source.paused) return;
			_self._$currentPosition.val(_self._VideoSource.getPosition() * 500);
		},

		canplaythrough: function () {
			_self._AACanvas.adjustScale(_self._VideoSource.source);
		}
	});

	this._init();
}
AAPlayer.prototype = {
	_init: function () {
		var _self = this;

		// インカメラのストリームを取得
		this._VideoSource.getUserVideoMedia(function (stream) {
			_self.play(stream);

		}, function (e) {
			// alert("Not supported.");
			_self.play("drop.mp4");
		});

		this.setVolume($('#volume').val());
	},

	play: function (stream) {
		if (stream) {
			this._VideoSource.setStream(stream);
		}

		if (this._playing) return;
		this._playing = true;
		this._VideoSource.play();

		if (this._animationFrame === null) {
			this._renderAAByCanvasImage();
		}
	},

	pause: function () {
		if (!this._playing) return;
		this._playing = false;
		this._VideoSource.pause();
	},

	isPlaying: function () {
		return this._playing;
	},

	setPosition: function (value) {
		this._VideoSource.setPosition(+value / 500);
	},

	setVolume: function (volume) {
		this._VideoSource.setVolume(+volume / 100);
	},

	_renderAAByCanvasImage: function () {
		var imageWidth = this._AACanvas.cfw | 0;
		var imageHeight = (imageWidth / this._AACanvas.WPH | 0) || 1;
		var _self = this;

		try {
			this._context.drawImage(this._VideoSource.source, 0, 0, imageWidth, imageHeight);

		} catch (e) {
			if (e.name === "NS_ERROR_NOT_AVAILABLE") {
				setTimeout(function () {
					_self._renderAAByCanvasImage();
				}, 100);

				console.warn(e);
			} else {
				throw e;
			}
		}

		this._AACanvas.draw(this._AARenderer.render(
			this._context.getImageData(0, 0, imageWidth, imageHeight),
			this._AACanvas.cfw,
			this._AACanvas.cfh
		));

		this._animationFrame = window.requestAnimationFrame(function () {
			_self._renderAAByCanvasImage();
		});
	}
}