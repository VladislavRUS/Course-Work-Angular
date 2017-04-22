function ManualExperimentController($rootScope, tableGenerateFactory, tableDrawFactory, clusterFactory, graphFactory) {
	var self = this;

	self.matrixSize = 30;
	self.possibility = 0.5;
	self.maxPossibility = 0.5;
	self.fillMode = 'random';
	self.testMode = 'checker';
	self.currentMatrix = null;

	var tablePlace = document.getElementById('tablePlace');

	var route = [];
	var forbidden = [];

	self.generate = function () {
		forbidden = [];

		switch (self.fillMode) {
			case 'random': {

				self.generateRandom();
				break;
			}

			case 'gradient': {
				self.generateGradient();
				break;
			}

			case 'test': {
				self.generateTest();
				break;
			}
		}

	};

	self.generateTest = function () {
		switch (self.testMode) {
			case 'checker': {
				self.generateChecker();
				break;
			}

			case 'horizontal': {
				self.generateHorizontal();
				break;
			}

			case 'vertical': {
				self.generateVertical();
				break;
			}

			case 'rain': {
				self.generateRain();
				break;
			}

			case 'rings': {
				self.generateRings();
				break;
			}
		}
	};

	self.generateChecker = function () {
		var size = self.matrixSize;
		var generatedMatrix = tableGenerateFactory.generateChecker(size);

		self.currentMatrix = angular.copy(generatedMatrix);

		tableDrawFactory.drawMatrix(tablePlace, generatedMatrix);
	};

	self.generateHorizontal = function () {
		var size = self.matrixSize;
		var generatedMatrix = tableGenerateFactory.generateHorizontal(size);

		self.currentMatrix = angular.copy(generatedMatrix);

		tableDrawFactory.drawMatrix(tablePlace, generatedMatrix);
	};

	self.generateVertical = function () {
		var size = self.matrixSize;
		var generatedMatrix = tableGenerateFactory.generateVertical(size);

		self.currentMatrix = angular.copy(generatedMatrix);

		tableDrawFactory.drawMatrix(tablePlace, generatedMatrix);
	};

	self.generateRain = function () {
		var size = self.matrixSize;
		var generatedMatrix = tableGenerateFactory.generateRain(size);

		self.currentMatrix = angular.copy(generatedMatrix);

		tableDrawFactory.drawMatrix(tablePlace, generatedMatrix);
	};

	self.generateRings = function () {
		var size = self.matrixSize;
		var generatedMatrix = tableGenerateFactory.generateRings(size);

		self.currentMatrix = angular.copy(generatedMatrix);

		tableDrawFactory.drawMatrix(tablePlace, generatedMatrix);
	};

	self.generateRandom = function () {
		var size = self.matrixSize;

		var p = self.possibility;
		var generatedMatrix = tableGenerateFactory.generateRandom(size, p);

		self.currentMatrix = angular.copy(generatedMatrix);

		tableDrawFactory.drawMatrix(tablePlace, generatedMatrix);
	};

	self.generateGradient = function () {
		var size = self.matrixSize;

		var p = self.possibility;
		var pMax = self.maxPossibility;

		var generatedMatrix = tableGenerateFactory.generateGradient(size, p, pMax);

		self.currentMatrix = angular.copy(generatedMatrix);

		tableDrawFactory.drawMatrix(tablePlace, generatedMatrix);
	};

	self.findClusters = function () {

		clusterFactory.findClusters(self.currentMatrix).then(function (clusteredMatrix) {
			tableDrawFactory.drawMatrix(tablePlace, clusteredMatrix, true);
		});
	};

	$rootScope.$on('tdClick', function (event, args) {
		var elm = document.getElementById(args.idx);
		var ctrlKey = args.ctrl;

		if (ctrlKey) {
			forbidden.push({i: args.i, j: args.j, idx: args.idx});
			elm.className += 'forbidden';

		} else {
			if (route.length == 2) {
				var cell = route.shift();
				document.getElementById(cell.idx).classList.remove('route');
			}

			route.push({i: args.i, j: args.j, idx: args.idx});
			elm.className += 'route';
		}
	});

	self.findPath = function () {
		if (route.length < 2) {
			alert('Выберите две точки!');
			return;
		}

		tableDrawFactory.drawMatrix(tablePlace, self.currentMatrix);

		graphFactory.findPathBetweenTwoPoints(route[0].idx, route[1].idx, self.currentMatrix, forbidden, route).then(function (data) {
			tableDrawFactory.markPath(data.withoutForbidden.split(' '));

			tableDrawFactory.markDiff(data.statistics.diff);

			if (data.statistics.diff.length > 0) {
				tableDrawFactory.markBorder(data.withForbidden.split(' '));
			}

			self.withoutForbiddenLength = data.statistics.withoutForbiddenLength;
			self.withForbiddenLength = data.statistics.withForbiddenLength;
			self.greenCells = data.statistics.diff.length;
		});
	};
}