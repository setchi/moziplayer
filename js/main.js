require.config({
	baseUrl: 'js/',
	paths: {
		'jquery': 'lib/jquery-2.1.1.min'
	}
});


require(['jquery', 'aa-canvas', 'aa-player', 'aa-renderer', 'video-source'],
	function ($, AACanvas, AAPlayer, AARenderer, VideoSource) {
	"use strict";

	function cancelEvent(e) {
		e.preventDefault();
		e.stopPropagation();
		return false;
	}


	var videoSource = VideoSource(document.getElementById("video"));
	var canvas = AACanvas(document.getElementById('canvas'));
	var player = AAPlayer(canvas, videoSource, AARenderer());


	// 再生/停止 切り替え
	$('#playButton').mousedown(function (e) {
		if (player.isPlaying()) {
			player.pause();
			$(this).find('>span').removeClass('icon-pause').addClass('icon-play');

		} else {
			player.play();
			$(this).find('>span').removeClass('icon-play').addClass('icon-pause');
		}

		return cancelEvent(e);
	});


	// 全画面表示
	$('#fullScreen').click(function () {
		var target = document.getElementsByTagName('html')[0];

		if (target.webkitRequestFullScreen) {
			target.webkitRequestFullScreen();

		} else if (target.mozRequestFullScreen) {
			target.mozRequestFullScreen();
		}
	});


	// 動画ファイルドロップ
	$(document).bind("drop", function (e) {
		player.play(window.URL.createObjectURL(e.originalEvent.dataTransfer.files[0]));
		var source = videoSource.getSource();
		canvas.adjustScale(source.videoWidth, source.videoHeight);
		return cancelEvent(e);

	}).bind("dragover", cancelEvent).bind("dragenter", cancelEvent);


	(function () {
		var isMousedown = false;
		// 再生位置の操作
		$('#currentPosition').change(function () {
			player.setPosition($(this).val());

		}).mousedown(function () {
			isMousedown = true;
			player.pause();

		}).mouseup(function () {
			isMousedown = false;
			player.play();

		}).mousemove(function () {
			if (isMousedown) {
				player.setPosition($(this).val());
			}
		});


		// 音量の操作
		$('#volume').change(function () {
			player.setVolume($(this).val());

		}).mousedown(function () {
			isMousedown = true;

		}).mouseup(function () {
			isMousedown = false;

		}).mousemove(function () {
			if (isMousedown) {
				player.setVolume($(this).val());
			}
		});


		// AA解像度の操作
		$('#resolution').change(function () {
			var source = videoSource.getSource();
			canvas.applyScale(source.videoWidth, source.videoHeight, $(this).val());

		}).mousedown(function () {
			isMousedown = true;

		}).mouseup(function () {
			isMousedown = false;

		}).mousemove(function () {
			if (isMousedown) {
				var source = videoSource.getSource();
				canvas.applyScale(source.videoWidth, source.videoHeight, $(this).val());
			}
		});


		// マウスオーバー or 操作中以外はコントローラを非表示
		var $controller = $('#controller');
		var controllerHiddenRequest = false;

		$controller.mouseenter(function (e) {
			$(this).removeClass('transparency');
		}).mouseleave(function(e) {
			controllerHiddenRequest = true;
		});

		$(document).mousemove(function () {
			if (!isMousedown && controllerHiddenRequest) {
				controllerHiddenRequest = false;
				$controller.addClass('transparency');
			}
		});


		// 画面リサイズ
		$(window).resize(function () {
			var timer = null;

			function screenResize() {
				canvas.resize();

				// コントローラのScale調整
				var baseWidth = parseInt($controller.width());
				var baseHeight = parseInt($controller.height());
				var headerHeight = 0;
				var scale = Math.min(
					$(window).width() * 0.6 / baseWidth, 
					($(window).height() * 0.6 - headerHeight) / baseHeight
				);
				var bottom = (baseHeight - baseHeight * scale) / -2 + headerHeight + scale * 10;

				$controller.css({
					'-webkit-transform': 'scale(' + scale + ', ' + scale + ')',
					'transform': 'scale(' + scale + ', ' + scale + ')',
					'bottom': bottom + 'px'
				});
			}

			return function (e) {
				clearTimeout(timer);
				timer = setTimeout(screenResize, 50);
			}
		}()).resize();
	}());
});
