define(function () {
"use strict";

/**
 * HTML5 Video要素のラッパー
 * @param {HTMLVideoElement} source
 */
return function (source) {
	var module = {};


	/**
	 * イベントを登録する
	 * @param  {String} eventName
	 * @param  {Function} listener
	 */
 	module.on = function (eventName, listener) {
 		source.addEventListener(eventName, listener);
 	};


 	/**
 	 * 再生
 	 */
 	module.play = function () {
 		if (source.paused) {
 			source.play();
 		}
 	};


 	/**
 	 * 一時停止
 	 */
 	module.pause = function () {
 		if (!source.paused) {
 			source.pause();
 		}
 	};


 	/**
 	 * 音量を変更
 	 * @param {Number} volume
 	 */
 	module.setVolume = function (volume) {
		source.volume = volume;
	};


	/**
	 * ソース変更
	 * @param {Object} 動画URIの文字列 | createObjectURLの戻り値
	 */
	module.setStream = function (stream) {
		source.srcObject = stream;
	};


	/**
	 * 再生位置を変更
	 * @param {Number} value
	 */
	module.setPosition = function (value) {
		try {
			source.currentTime = source.duration * value;

		} catch (e) {
			console.warn(e);
		}
	};


	/**
	 * 再生位置を取得
	 * @return {Number} 再生位置
	 */
	module.getPosition = function () {
		return source.currentTime / source.duration;
	};


	/**
	 * ソース取得
	 * @return {HTMLVideoElement}
	 */
	module.getSource = function () {
		return source;
	};


	/**
	 * ユーザーのビデオメディアを取得する
	 * @param  {Function} onSuccess
	 * @param  {Function} onError
	 */
 	module.getUserVideoMedia = function (onSuccess, onError) {

		navigator.mediaDevices.getUserMedia({
			video: true

		}).then(function (stream) {
			onSuccess(stream)
		
		}).catch(function (e) {
			onError(e)
		});
 	};

 	return module;
}

});