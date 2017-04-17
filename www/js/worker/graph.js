var graph = {
	makeGraph: function (matrix, from, to, forbidden) {
		var self = this;

		var start = new Date().getTime();


		var graph = self.constructGraph(matrix);

		var pathWithoutForbidden = self.findPath(graph, from, to);

		forbidden.forEach(function (f) {
			for (var i = 0; i < graph[f.idx].length; i++) {
				self.setMatrixValue(f.idx, i, Number.MAX_VALUE, graph);
			}
		});

		var pathWithForbidden = self.findPath(graph, from, to);

		var end = new Date().getTime();

		console.log('Made graph in : ' + (end - start));

		return {
			withoutForbidden: pathWithoutForbidden,
			withForbidden: pathWithForbidden
		}
	},

	constructGraph: function(matrix) {
		var self = this;

		var len = Math.pow(matrix.length, 2);
		var graph = new Array(len);
		var copy = new Array(len);

		for (var i = 0; i < len; i++) {
			copy[i] = Number.MAX_VALUE
		}

		for (var i = 0; i < graph.length; i++) {
			graph[i] = copy.slice(0);
		}

		for (var i = 0; i < matrix.length; i++) {
			for (var j = 0; j < matrix.length; j++) {
				var elm = matrix[i][j];

				var elmIdx = elm.idx;

				var neighbours = util.getNeighbours(i, j, matrix);

				try {
					neighbours.forEach(function (n) {
						var nIdx = n.idx;

						if (graph[nIdx][elmIdx] == Number.MAX_VALUE) {
							if (n.cluster == elm.cluster && n.cluster !== -1 && elm.cluster !== -1) {
								self.setMatrixValue(elmIdx, nIdx, 0.001, graph);

							} else {
								self.setMatrixValue(elmIdx, nIdx, 10000, graph);
							}
						}
					});

				} catch (err) {
				}
			}
		}

		return graph;
	},

	findPath: function (graph, from, to) {
		var self = this;
		var start = from;
		var to = to;

		var path = self.dijkstra(start, graph);

		return path[to];
	},

	findShortestPath: function(matrix) {
		var self = this;

		var graph = self.constructGraph(matrix);

		var from = [], to = [];

		var topRow = 0, bottomRow = matrix.length - 1;

		for (var j = 0; j < matrix.length; j++) {
			to.push(matrix[topRow][j]);
			from.push(matrix[bottomRow][j]);
		}

		var allPaths = [];

		from.forEach(function(f) {
			var path = self.dijkstra(f.idx, graph);

			to.forEach(function(t) {
				allPaths.push(path[t.idx]);
			});
		});

		self.getShortest(allPaths, matrix);
	},

	getShortest: function(allPaths, matrix) {
		var self = this;

		allPaths = allPaths.map(function(path) {
			return path.split(' ');
		});

		var p = allPaths[0];

		self.getNumberOfWhiteCell(p, matrix);

		/*allPaths = allPaths.sort(function(p1, p2) {
			return p1.length - p2.length;
		});*/


	},

	getNumberOfWhiteCell: function(path, matrix) {
		var self = this;



		var cnt = 0;
	},

	dijkstra: function (start, graph) {
		var startTime = new Date().getTime();

		var d = new Array(graph.length);
		var visited = new Array(graph.length);
		var p = new Array(graph.length);

		for (var i = 0; i < d.length; i++) {
			d[i] = Number.MAX_VALUE;
			visited[i] = false;
		}

		d[start] = 0;
		p[start] = start;

		for (var i = 0; i < graph.length; i++) {
			var v = null;

			for (var j = 0; j < graph.length; j++) {
				if (!visited[j] && (v == null || d[j] < d[v])) {
					v = j;
				}
			}

			if (d[v] == Number.MAX_VALUE) break;

			visited[v] = true;

			for (var j = 0; j < graph.length; j++) {
				var edgeLen = graph[v][j];

				if (d[v] + edgeLen < d[j]) {
					d[j] = d[v] + edgeLen;
					p[j] = p[v] + ' ' + j;
				}
			}
		}

		var endTime = new Date().getTime();

		console.log('Dijkstra finished in: ' + (endTime - startTime));

		return p;
	},

	setMatrixValue: function (i, j, value, matrix) {
		matrix[i][j] = value;
		matrix[j][i] = value;
	},

	getIndex: function (elem, matrix) {
		var cnt = 0;
		for (var i = 0; i < matrix.length; i++) {
			for (var j = 0; j < matrix.length; j++) {
				if (matrix[i][j] == elem) {
					return cnt;
				} else {
					cnt++;
				}
			}
		}

		return -1;
	}
};
