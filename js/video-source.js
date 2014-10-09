/*
 * HTML5 video要素のラッパー
 */

var VideoSource = function (source) {
	this.source = source;
}
VideoSource.prototype = {
 	addEventListeners: function (listeners) {
 		for (var eventName in listeners) if (listeners.hasOwnProperty(eventName)) {
 			this.source.addEventListener(eventName, listeners[eventName]);
 		}
 	},

 	play: function () {
 		if (this.source.paused) {
 			this.source.play();
 		}
 	},

 	pause: function () {
 		if (!this.source.paused) {
 			this.source.pause();
 		}
 	},

 	setVolume: function (volume) {
		this.source.volume = volume;
	},

	setStream: function (stream) {
		this.source.src = stream;
	},

	setPosition: function (value) {
		try {
			this.source.currentTime = this.source.duration * value;

		} catch (e) {
			console.warn(e);
		}
	},

	getPosition: function () {
		return this.source.currentTime / this.source.duration;
	},

 	getUserVideoMedia: function (onSuccess, onError) {
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
 	},
}
