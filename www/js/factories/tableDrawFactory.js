function tableDrawFactory($timeout, $rootScope) {

	var factory = {};

	factory.drawMatrix = function (elem, matrix, colorful) {
		elem.innerHTML = '';

		var table = document.createElement('table');

		var N = matrix.length;
		var width = $(elem).width() / 2;

		var cellSize = width / N + 'px';

		for (var i = 0; i < matrix.length; i++) {
			var tr = document.createElement('tr');

			for (var j = 0; j < matrix.length; j++) {
				var td = document.createElement('td');

				td.style.width = cellSize;
				td.style.height = cellSize;

				for (var prop in matrix[i][j]) {
					td.setAttribute(prop, matrix[i][j][prop]);
				}

				td.setAttribute('id', matrix[i][j].idx);

				if (!colorful) {
					if (matrix[i][j].color == 'white') {
						td.style.backgroundColor = 'white';

					} else {
						td.style.backgroundColor = 'black';
					}

				} else {
					td.style.backgroundColor = matrix[i][j].color;
				}

				td.addEventListener('click', tdClick);

				tr.appendChild(td);
			}

			table.appendChild(tr);
		}

		elem.appendChild(table);
	};

	factory.markPath = function(path) {
		path.forEach(function(p, idx) {
			$timeout(function() {

				var elm = document.getElementById(p);

				if (elm.style.backgroundColor == 'black') {
					elm.style.backgroundColor = 'orange';

				} else if (elm.style.backgroundColor == 'white') {
					elm.style.backgroundColor = 'red';

				} else {
					elm.style.backgroundColor = 'green';
				}
			}, 50 * idx);
		});
	};

	function tdClick(event) {
		$rootScope.$emit('tdClick', {
			i: this.getAttribute('i'),
			j: this.getAttribute('j'),
			idx: this.getAttribute('idx'),
			ctrl: event.ctrlKey
		});
	}

	return factory;
}