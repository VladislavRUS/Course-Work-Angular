function tableGenerateFactory() {
	var factory = {};

	factory.generateRandom = function (size, p) {
		var matrix = factory.createEmptyMatrix(size);

		var cnt = 0;

		for (var i = 0; i < size; i++) {
			for (var j = 0; j < size; j++) {
				matrix[i][j] = factory.createCell(i, j, cnt++, p);
			}
		}

		return matrix;
	};

	factory.generateGradient = function (size, p, maxP) {
		var matrix = factory.createEmptyMatrix(size);

		var cnt = 0;

		var startP = p * 2 - maxP;

		var step = (maxP - startP) / (matrix.length / 2);

		for (var i = 0, pos = startP; i < matrix.length / 2; i++, pos += step) {
			for (var j = 0; j < matrix.length; j++) {
				matrix[i][j] = factory.createCell(i, j, cnt++, pos);
			}
		}

		for (var i = matrix.length / 2 - 1, pos = maxP; i < matrix.length; i++, pos -= step) {
			for (var j = 0; j < matrix.length; j++) {
				matrix[i][j] = factory.createCell(i, j, cnt++, pos);
			}
		}

		return matrix;
	};

	factory.createCell = function (i, j, idx, p) {
		return {
			i: i,
			j: j,
			idx: idx,
			color: p > Math.random() ? 'black': 'white'
		}

	};

	factory.createEmptyMatrix = function (size) {
		var matrix = [];

		for (var i = 0; i < size; i++) {
			matrix[i] = new Array(size);
		}

		return matrix;
	};

	return factory;
}