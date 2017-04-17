function clusterFactory($q) {
	var factory = {};

	factory.findClusters = function (matrix) {
		var deferred = $q.defer();

		var worker = new Worker('/js/worker/worker.js');

		worker.postMessage({action:'findClusters', matrix: matrix});

		worker.addEventListener('message', function(event) {
			deferred.resolve(event.data.matrix);
		});

		return deferred.promise;
	};

	return factory;
}