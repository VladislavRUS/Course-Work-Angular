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
			color: p > Math.random() ? 'black' : 'white'
		}

	};

	factory.createTestCell = function (i, j, idx, color) {
		return {
			i: i,
			j: j,
			idx: idx,
			color: color
		}
	};

	factory.createEmptyMatrix = function (size) {
		var matrix = [];

		for (var i = 0; i < size; i++) {
			matrix[i] = new Array(size);
		}

		return matrix;
	};

	factory.generateChecker = function (size) {
		var matrix = factory.createEmptyMatrix(size);
		var cnt = 0;

		for (var i = 0; i < matrix.length; i++) {
			for (var j = 0; j < matrix.length; j++) {
				if (i % 2 == 0) {
					if (j % 2 == 0) {
						matrix[i][j] = factory.createTestCell(i, j, cnt++, 'black');
					} else {
						matrix[i][j] = factory.createTestCell(i, j, cnt++, 'white');
					}
				} else {
					if (j % 2 == 0) {
						matrix[i][j] = factory.createTestCell(i, j, cnt++, 'white');
					} else {
						matrix[i][j] = factory.createTestCell(i, j, cnt++, 'black');
					}
				}
			}
		}

		return matrix;
	};

	factory.generateHorizontal = function (size) {
		var matrix = factory.createEmptyMatrix(size);
		var cnt = 0;

		for (var i = 0; i < matrix.length; i++) {
			for (var j = 0; j < matrix.length; j++) {
				if (i % 2 == 0) {
					matrix[i][j] = factory.createTestCell(i, j, cnt++, 'black');

				} else {
					matrix[i][j] = factory.createTestCell(i, j, cnt++, 'white');
				}
			}
		}

		return matrix;
	};

	factory.generateVertical = function (size) {
		var matrix = factory.createEmptyMatrix(size);
		var cnt = 0;

		for (var i = 0; i < matrix.length; i++) {
			for (var j = 0; j < matrix.length; j++) {
				if (j % 2 == 0) {
					matrix[i][j] = factory.createTestCell(i, j, cnt++, 'black');

				} else {
					matrix[i][j] = factory.createTestCell(i, j, cnt++, 'white');
				}
			}
		}

		return matrix;
	};

	factory.generateRain = function (size) {
		var matrix = factory.createEmptyMatrix(size);
		var cnt = 0;

		for (var i = 0; i < size; i++) {
			for (var j = 0; j < size; j++) {
				matrix[i][j] = factory.createTestCell(i, j, cnt++, 'white');
			}
		}

		for (var j = 0; j < matrix.length; j += 2) {
			for (var i = 0; i < matrix.length; i++) {

				var number = Math.floor(Math.random() * 3 + 1);

				var a = (i + number) > matrix.length ? matrix.length - 1 : i + number;
				for (var k = i; k < a; k++) {
					matrix[k][j].color = 'black';
				}

				i += (number + 2);
			}
		}

		return matrix;
	};

	factory.generateRings = function (size) {
		var matrix = factory.createEmptyMatrix(size);
		var cnt = 0;

		for (var i = 0; i < size; i++) {
			for (var j = 0; j < size; j++) {
				matrix[i][j] = factory.createTestCell(i, j, cnt++, 'white');
			}
		}

		for (var i = 0, j = 0; i < matrix.length / 2; i += 2, j += 2) {
			var first = i;
			var second = matrix.length - i - 1;

			fillRow(first, j, matrix.length - j, matrix, 'black');
			fillRow(second, j, matrix.length - j, matrix, 'black');
		}

		for (var i = 0, j = 0; i < matrix.length / 2; i += 2, j += 2) {
			var first = i;
			var second = matrix.length - i - 1;

			fillColumn(first, j, matrix.length - j, matrix, 'black');
			fillColumn(second, j, matrix.length - j, matrix, 'black');
		}


		console.log(matrix);

		return matrix;
	};


	function fillRow(rowIdx, start, end, matrix, color) {
		for (var j = start; j < end; j++) {
			matrix[rowIdx][j].color = color;
		}
	}

	function fillColumn(columnIdx, start, end, matrix, color) {
		for (var i = start; i < end; i++) {
			matrix[i][columnIdx].color = color;
		}
	}

	return factory;
}