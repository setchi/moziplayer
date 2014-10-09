$(function () {
	var canvas = new AACanvas(document.getElementById('canvas'));
	var videoSource = new VideoSource(document.getElementById("video"));
	var player = new AAPlayer(
		canvas,
		videoSource,
		new AARenderer()
	);

	function cancelEvent(e) {
		e.preventDefault();
		e.stopPropagation();
		return false;
	}

	// 動画ドロップ
	$(document).bind("dragenter", cancelEvent)
	.bind("dragover", cancelEvent)
	.bind("drop", function (e) {
		player.play(window.URL.createObjectURL(e.originalEvent.dataTransfer.files[0]));
		canvas.adjustScale(videoSource.source);
		return cancelEvent(e);
	});

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
		console.log('fullcanvas');
		var target = document.getElementsByTagName('html')[0];

		if (target.webkitRequestFullScreen) {
			target.webkitRequestFullScreen();

		} else if (target.mozRequestFullScreen) {
			target.mozRequestFullScreen();

		}
	});

	// シークバー操作
	(function () {
		var isMousedown = false;

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

		$('#resolution').change(function () {
			canvas.applyScale(videoSource.source, $(this).val());

		}).mousedown(function () {
			isMousedown = true;

		}).mouseup(function () {
			isMousedown = false;

		}).mousemove(function () {
			if (isMousedown) {
				canvas.applyScale(videoSource.source, $(this).val());
			}
		});

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

		// リサイズ
		$(window).resize(function () {
			var timer = null;

			function screenResize() {
				canvas.resize();

				// Controller resize.
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
