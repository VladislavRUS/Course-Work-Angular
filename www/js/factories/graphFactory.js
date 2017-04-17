function graphFactory($q, $rootScope) {
	var factory = {};

	var worker = new Worker('/js/worker/worker.js');

	worker.addEventListener('message', function (event) {
		$rootScope.$emit(event.data.action, event.data);
		//deferred.resolve(event.data);
	});

	factory.findPathBetweenTwoPoints = function (from, to, matrix, forbidden) {
		var deferred = $q.defer();

		worker.postMessage({action: 'graph', matrix: matrix, from: from, to: to, forbidden: forbidden});

		worker.addEventListener('message', function (event) {
			deferred.resolve(event.data.path);
		});

		return deferred.promise;
	};

	factory.iterativeExperiment = function (matrix, i, p) {
		//var deferred = $q.defer();

		//var worker = new Worker('/js/worker/worker.js');

		worker.postMessage({action: 'iterations', matrix: matrix, i: i, p: p});

		//return deferred.promise;
	};

	return factory;
}