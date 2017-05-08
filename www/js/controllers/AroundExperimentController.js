function AroundExperimentController($timeout, tableGenerateFactory, graphFactory) {
	var self = this;
	self.matrixSize = 30;
	self.iterations = 5;
	self.possibility = 0.5;
	self.results = [];

	var progressBar = document.getElementById('progressBar');

	self.start = function () {
		self.results = [];
		sequence(1, 0);
	};

	function sequence(i, h) {
		if (i == self.iterations * self.matrixSize) {
			processResults();
			return;
		}

		if (i % self.iterations == 0) {
			h++;
		}

		var size = self.matrixSize;
		var p = self.possibility;

		var generatedMatrix = tableGenerateFactory.generateRandom(size, p);

		var from = Math.floor(Math.random() * self.matrixSize);
		var bottomRow = self.matrixSize - 1;

		var to = Math.floor(Math.random() * self.matrixSize);
		var topRow = 0;

		graphFactory.findPathBetweenTwoPoints(generatedMatrix[bottomRow][from].idx, generatedMatrix[topRow][to].idx, generatedMatrix, []).then(function (path) {

			var withoutForbidden = path.withoutForbidden;

			var forbidden;

			forbidden = parseInt(withoutForbidden.split(' ')[h + 1]);

			graphFactory.findPathBetweenTwoPoints(generatedMatrix[bottomRow][from].idx, generatedMatrix[topRow][to].idx, generatedMatrix, [{idx: forbidden}]).then(function (path) {

				if (path) {
					var result = {
						height: h,
						poss: 1 - path.statistics.poss
					};

					self.results.push(result);
				}

				var nextIteration = i + 1;

				sequence(nextIteration, h);

				$(progressBar).progress({
					percent: (i * 100 / (self.iterations * self.matrixSize))
				});
			});
		});
	}

	function processResults() {

		$timeout(function () {
			$(progressBar).progress({
				percent: 100
			});
		}, 500);

		var obj = {};



		self.results.forEach(function (res) {
			if (!obj[res.height]) {
				obj[res.height] = {};
				obj[res.height].arr = [];
			}

			obj[res.height].arr.push(res.poss);
		});

		console.log(self.results);

		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				var arr = obj[prop].arr;

				var sum = 0;

				for (var i = 0; i < arr.length; i++) {
					sum += arr[i];
				}

				obj[prop] = parseFloat((sum / arr.length).toFixed(2));
			}
		}

		var trace = {
			x: [],
			y: []
		};

		for (var prop in obj) {

			trace.x.push(prop);
			trace.y.push(obj[prop]);
		}

		var layout = {
			xaxis: {title: 'Высота'},
			yaxis: {title: 'Лежит на старом пути'}
		};

		Plotly.newPlot('result', [trace], layout);

	}
}