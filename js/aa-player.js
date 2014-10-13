/**
 * AA描画に関する操作
 * @param {AACanvas} aaCanvas
 * @param {VideoSource} videoSource
 * @param {AARenderer} aaRenderer
 */
var AAPlayer = function (aaCanvas, videoSource, aaRenderer) {
	var module = {},
		animationFrame = null,
		playing = false,
		context = document.getElementById("buffer").getContext("2d"),
		$currentPosition = $('#currentPosition');


	/**
	 * Videoの画像をAAに変換してキャンバスに描画する
	 */
	function renderAAByCanvasImage () {
		var imageWidth = aaCanvas.cfw | 0;
		var imageHeight = (imageWidth / aaCanvas.WPH | 0) || 1;
		
		try {
			context.drawImage(videoSource.getSource(), 0, 0, imageWidth, imageHeight);
		} catch (e) {
			if (e.name === "NS_ERROR_NOT_AVAILABLE") {
				setTimeout(function () {
					renderAAByCanvasImage();
				}, 100);
				console.warn(e);
			} else {
				throw e;
			}
		}

		aaCanvas.draw(aaRenderer.render(
			context.getImageData(0, 0, imageWidth, imageHeight),
			aaCanvas.cfw,
			aaCanvas.cfh
		));

		animationFrame = window.requestAnimationFrame(renderAAByCanvasImage);
	}


	/**
	 * 再生
	 * @param {Object} [stream] 動画URIの文字列 | createObjectURLの戻り値
	 */
	module.play = function (stream) {
		if (stream) {
			videoSource.setStream(stream);
		}

		if (playing) return;
		playing = true;
		videoSource.play();

		if (animationFrame === null) {
			renderAAByCanvasImage();
		}
	};


	/**
	 * 一時停止
	 */
	module.pause = function () {
		if (!playing) return;
		playing = false;
		videoSource.pause();
	};


	/**
	 * 再生状態取得
	 * @return {Boolean}
	 */
	module.isPlaying = function () {
		return playing;
	};


	/**
	 * 再生位置を変更
	 * @param {Number} value
	 */
	module.setPosition = function (value) {
		videoSource.setPosition(+value / 500);
	};


 	/**
 	 * 音量を変更
 	 * @param {Number} volume
 	 */
	module.setVolume = function (volume) {
		videoSource.setVolume(+volume / 100);
	};


	// イベント登録
	videoSource.on('timeupdate', function () {
		if (videoSource.getSource().paused) return;
		$currentPosition.val(videoSource.getPosition() * 500);
	});
	
	videoSource.on('canplaythrough', function () {
		aaCanvas.adjustScale(videoSource.getSource());
	});

	// インカメラの映像再生を試みる
	videoSource.getUserVideoMedia(function (stream) {
		module.play(stream);

	}, function (e) {
		// alert("Not supported.");
		module.play("drop.mp4");
	});

	module.setVolume($('#volume').val());

	return module;
}