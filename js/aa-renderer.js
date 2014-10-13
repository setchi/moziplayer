/**
 * 縦横の文字数とCanvasのImageDataからAAを生成する
 */
var AARenderer = function () {
	var charTable = new ArrayBuffer(256 * 256);
	var rParam = 0.298912;
	var gParam = 0.586611;
	var bParam = 0.114478;

	// charTableを生成
	(function (charTable) {
		var chars = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
		var brightness = [
		    [255, 255],
		    [220, 228],
		    [219, 254],
		    [166, 202],
		    [189, 200],
		    [191, 212],
		    [208, 191],
		    [236, 254],
		    [225, 215],
		    [224, 216],
		    [204, 243],
		    [211, 232],
		    [253, 219],
		    [237, 229],
		    [253, 231],
		    [220, 231],
		    [190, 209],
		    [216, 216],
		    [201, 204],
		    [201, 211],
		    [198, 204],
		    [191, 211],
		    [191, 203],
		    [203, 233],
		    [180, 202],
		    [180, 214],
		    [232, 226],
		    [232, 218],
		    [211, 228],
		    [208, 230],
		    [211, 228],
		    [203, 229],
		    [178, 207],
		    [191, 187],
		    [173, 189],
		    [194, 208],
		    [185, 199],
		    [176, 193],
		    [177, 214],
		    [187, 194],
		    [174, 194],
		    [206, 213],
		    [205, 208],
		    [177, 198],
		    [208, 195],
		    [166, 190],
		    [172, 194],
		    [186, 201],
		    [179, 209],
		    [187, 175],
		    [176, 195],
		    [187, 196],
		    [176, 216],
		    [186, 204],
		    [183, 218],
		    [167, 196],
		    [185, 196],
		    [189, 215],
		    [191, 201],
		    [220, 212],
		    [220, 231],
		    [220, 211],
		    [225, 254],
		    [254, 219],
		    [238, 254],
		    [209, 189],
		    [188, 191],
		    [207, 206],
		    [186, 190],
		    [202, 193],
		    [190, 212],
		    [205, 172],
		    [192, 200],
		    [219, 210],
		    [212, 206],
		    [193, 199],
		    [214, 212],
		    [188, 183],
		    [207, 200],
		    [209, 199],
		    [202, 167],
		    [202, 167],
		    [211, 212],
		    [206, 194],
		    [207, 214],
		    [213, 198],
		    [204, 215],
		    [200, 193],
		    [206, 197],
		    [206, 188],
		    [210, 202],
		    [215, 209],
		    [223, 225],
		    [215, 209],
		    [230, 244]
		];
		var charNum = chars.length;
		var min = 0xff;

		for (var i = 0; i < charNum; i++) {
			var avg = (brightness[i][0] + brightness[i][1]) / 2;

			if (avg < min) {
				min = avg;
			}
		}

		for (var i = 0; i < charNum; i++) {
			for (var j = 0; j < 2; j++) {
				brightness[i][j] = 0xff * (brightness[i][j] - min) / (0xff - min);
			}
		}

		for (var i = 0; i < 256; i++) {
			for (var j = 0; j < 256; j++) {
				var costMin = -1;
				var indexMin = 0;

				for (var k = 0; k < charNum; k++) {
					var difDown = j - brightness[k][1];
					var difUp   = i - brightness[k][0];
					var difAv   = difUp + difDown;
					var cost    = difUp * difUp + difDown * difDown + difAv * difAv * difAv * difAv / 1024;

					if (costMin < 0 || cost < costMin){
						costMin = cost;
						indexMin = k;
					}
				}

				charTable[i * 256 + j] = chars[indexMin];
			}
		}
		
	}(charTable))

	return {


		/**
		 * AAを生成
		 * @param  {ImageData} img
		 * @param  {Number} cfw AAの横の文字数
		 * @param  {Nunber} cfh AAの縦の文字数
		 * @return {String} 生成したAA
		 */
		render: function (img, cfw, cfh) {
			cfw |= 0;
			cfh |= 0;
			var wOffset = img.width / cfw;
			var hOffset = img.height / cfh;
			var hOffset2 = hOffset * 0.25;
			var hOffset3 = hOffset * 0.75;
			var wOffset2 = wOffset * 0.5;
			var imgData = img.data;
			var res = "";
			
			for (var y = 0; y < cfh; y++) {
				var uy = (y * hOffset + hOffset2 | 0) * img.width | 0;
				var dy = (y * hOffset + hOffset3 | 0) * img.width | 0;

				for (var x = 0; x < cfw; x++) {
					var mx = x * wOffset + wOffset2 | 0;
					var idx1 = uy + mx << 2 | 0;
					var idx2 = dy + mx << 2 | 0;

					res += charTable[
						((imgData[idx1  ] * rParam +
						  imgData[idx1+1] * gParam +
						  imgData[idx1+2] * bParam | 0) << 8) + 
						((imgData[idx2  ] * rParam +
						  imgData[idx2+1] * gParam +
						  imgData[idx2+2] * bParam | 0))
					];
				}

				res += "\n";
			}

			return res;
		}
	}
}
