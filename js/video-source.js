/*
 * HTML5 video要素のラッパー
 */

var VideoSource = function (source) {
	var module = {};

 	module.on = function (eventName, eventCallback) {
 		source.addEventListener(eventName, eventCallback);
 	};

 	module.play = function () {
 		if (source.paused) {
 			source.play();
 		}
 	};

 	module.pause = function () {
 		if (!source.paused) {
 			source.pause();
 		}
 	};

 	module.setVolume = function (volume) {
		source.volume = volume;
	};

	module.setStream = function (stream) {
		source.src = stream;
	};

	module.setPosition = function (value) {
		try {
			source.currentTime = source.duration * value;

		} catch (e) {
			console.warn(e);
		}
	};

	module.getPosition = function () {
		return source.currentTime / source.duration;
	};

	module.getSource = function () {
		return source;
	};

 	module.getUserVideoMedia = function (onSuccess, onError) {
		navigator.getUserMedia = navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia ||
			navigator.msGetUserMedia;

		if (!window.URL || !navigator.getUserMedia) {
			alert("Not supported.");
			return;
		}

		navigator.getUserMedia({
			video: true

		}, function (stream) {
			onSuccess(window.URL.createObjectURL(stream))
		
		}, function (e) {
			onError(e)
		});
 	};

 	return module;
}
