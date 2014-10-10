/*
 * AA描画の操作
 */

var AAPlayer = function (aaCanvas, videoSource, aaRenderer) {
	var module = {},
		animationFrame = null,
		playing = false,
		context = document.getElementById("buffer").getContext("2d"),
		$currentPosition = $('#currentPosition');

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

		animationFrame = window.requestAnimationFrame(function () {
			renderAAByCanvasImage();
		});
	}

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

	module.pause = function () {
		if (!playing) return;
		playing = false;
		videoSource.pause();
	};

	module.isPlaying = function () {
		return playing;
	};

	module.setPosition = function (value) {
		videoSource.setPosition(+value / 500);
	};

	module.setVolume = function (volume) {
		videoSource.setVolume(+volume / 100);
	};

	// init
	videoSource.addEventListeners({
		timeupdate: function () {
			if (videoSource.getSource().paused) return;
			$currentPosition.val(videoSource.getPosition() * 500);
		},

		canplaythrough: function () {
			aaCanvas.adjustScale(videoSource.getSource());
		}
	});

	// インカメラのストリームを取得
	videoSource.getUserVideoMedia(function (stream) {
		module.play(stream);

	}, function (e) {
		// alert("Not supported.");
		module.play("drop.mp4");
	});

	module.setVolume($('#volume').val());

	return module;
}