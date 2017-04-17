function AutoExperimentController($timeout, $rootScope, tableGenerateFactory, graphFactory, tableDrawFactory) {
	var self = this;

	self.matrixSize = 30;
	self.iterations = 10;
	self.currPercent = 0;
	self.working = false;
	self.data = [];
	self.show = false;
	self.detailed = false;

	var progressBar = document.getElementById('progressBar')

	self.start = function () {
		self.data = [];
		self.working = true;
		self.show = false;

		$timeout(function () {
			for (var i = 0; i < self.iterations; i++) {
				for (var p = 0.05; p < 0.95; p += 0.05) {

					var matrix = tableGenerateFactory.generateRandom(self.matrixSize, p);

					graphFactory.iterativeExperiment(matrix, i, p);
				}
			}
		}, 100);
	};

	self.toggleDetailed = function() {
		self.detaield = !self.detailed;
	};

	self.onClick = function () {
		var idx = self.currentExperiment;

		var exp = self.data[idx];

		var tablePlace = document.getElementById('tablePlace');

		tableDrawFactory.drawMatrix(tablePlace, exp.matrix, false);

		var path = exp.arr.map(function (el) {
			return el.idx;
		});

		tableDrawFactory.markPath(path);

	};

	$rootScope.$on('iterations', function (event, args) {
		self.data.push(args);

		$(progressBar).progress({
			percent: (self.data.length * 100 / (self.iterations * 18))
		});

		out();
	});

	function out() {
		if (self.data.length == self.iterations * 18) {
			self.working = false;

			self.show = true;

			$timeout(function () {
				$('#select').dropdown();
				processData();
			}, 100);
		}
	}

	function processData() {
		var obj = {};

		for (var i = 0; i < self.data.length; i++) {
			var data = self.data[i];

			if (!obj.hasOwnProperty(data.p)) {
				obj[data.p] = {};
				obj[data.p].iterations = [];
			}

			obj[data.p].iterations.push(data);
		}

		console.log(obj);

		averageRed(obj);
		averagePathLength(obj);
		averageHolesSize(obj);
		averageHolesNumber(obj);
	}

	function averageRed(obj) {
		var trace = {
			x: [],
			y: []
		};

		for (var prop in obj) {

			trace.x.push(prop);

			var iterations = obj[prop].iterations;

			var red = 0;

			iterations.forEach(function (i) {
				red += i.statistics.whiteCells;
			});

			trace.y.push(red / (iterations.length * self.matrixSize));
		}

		var layout = {
			xaxis: {title: 'Концентрация'},
			yaxis: {title: 'Количество красных'}
		};

		Plotly.newPlot('averageRed', [trace], layout);
	}

	function averagePathLength(obj) {
		var trace = {
			x: [],
			y: []
		};

		for (var prop in obj) {

			trace.x.push(prop);

			var iterations = obj[prop].iterations;

			var length = 0;

			iterations.forEach(function (i) {
				length += i.statistics.length;
			});

			trace.y.push(length / (iterations.length * self.matrixSize));
		}

		var layout = {
			xaxis: {title: 'Концентрация'},
			yaxis: {title: 'Длина перколяционного пути'}
		};

		Plotly.newPlot('averagePathLength', [trace], layout);
	}

	function averageHolesSize(obj) {
		var trace = {
			x: [],
			y: []
		};

		for (var prop in obj) {

			trace.x.push(prop);

			var iterations = obj[prop].iterations;

			var holesAmount = 0, holesSize = 0;

			iterations.forEach(function (i) {
				holesAmount += i.statistics.holes.length;

				i.statistics.holes.forEach(function (h) {
					holesSize += h.length;
				})
			});

			if (holesSize == 0) {
				trace.y.push(0);

			} else {
				trace.y.push(holesSize / (holesAmount * self.matrixSize));
			}
		}

		var layout = {
			xaxis: {title: 'Концентрация'},
			yaxis: {title: 'Размер дырки'}
		};

		Plotly.newPlot('averageHolesSize', [trace], layout);
	}

	function averageHolesNumber(obj) {
		var trace = {
			x: [],
			y: []
		};

		for (var prop in obj) {

			trace.x.push(prop);

			var iterations = obj[prop].iterations;

			var number = 0;

			iterations.forEach(function (i) {
				number += i.statistics.holes.length;
			});

			trace.y.push(number / (iterations.length * self.matrixSize));
		}

		var layout = {
			xaxis: {title: 'Концентрация'},
			yaxis: {title: 'Количество дырок'}
		};

		Plotly.newPlot('averageHolesNumber', [trace], layout);
	}
}