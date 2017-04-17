function ManualExperimentController($rootScope, tableGenerateFactory, tableDrawFactory, clusterFactory, graphFactory) {
	var self = this;

	self.matrixSize = 30;
	self.possibility = 0.5;
	self.maxPossibility = 0.5;
	self.fillMode = 'random';
	self.currentMatrix = null;

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
		}

	};

	self.generateRandom = function () {
		var size = self.matrixSize;

		var p = self.possibility;
		var generatedMatrix = tableGenerateFactory.generateRandom(size, p);

		self.currentMatrix = angular.copy(generatedMatrix);

		var tablePlace = document.getElementById('tablePlace');

		tableDrawFactory.drawMatrix(tablePlace, generatedMatrix);
	};

	self.generateGradient = function () {
		var size = self.matrixSize;

		var p = self.possibility;
		var pMax = self.maxPossibility;

		var generatedMatrix = tableGenerateFactory.generateGradient(size, p, pMax);

		self.currentMatrix = angular.copy(generatedMatrix);

		var tablePlace = document.getElementById('tablePlace');

		tableDrawFactory.drawMatrix(tablePlace, generatedMatrix);
	};

	self.findClusters = function () {
		var tablePlace = document.getElementById('tablePlace');

		clusterFactory.findClusters(self.currentMatrix).then(function (clusteredMatrix) {
			tableDrawFactory.drawMatrix(tablePlace, clusteredMatrix, true);
		});
	};

	$rootScope.$on('tdClick', function(event, args) {
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

	self.findPath = function() {
		if (route.length < 2) {
			alert('Выберите две точки!');
			return;
		}
		var tablePlace = document.getElementById('tablePlace');

		tableDrawFactory.drawMatrix(tablePlace, self.currentMatrix);

		graphFactory.findPathBetweenTwoPoints(route[0].idx, route[1].idx, self.currentMatrix, forbidden, route).then(function(data) {
			tableDrawFactory.markPath(data.withForbidden.split(' '));

			tableDrawFactory.markPath(data.withoutForbidden.split(' '));
		});
	}
}