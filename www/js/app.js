angular.module('app', ['ui.router', 'navController', 'ngAnimate'])
	.config(function ($stateProvider, $urlRouterProvider) {

		var viewsPrefix = 'views/';

		// For any unmatched url, send to /
		$urlRouterProvider.otherwise("/");

		$stateProvider
		// you can set this to no template if you just want to use the html in the page
			.state('about', {
				url: "/",
				templateUrl: viewsPrefix + "about.html",
				data: {
					pageTitle: 'О проекте'
				}
			})

			.state('manual-experiment', {
				url: "/manual-experiment",
				templateUrl: viewsPrefix + "manual-experiment.html",
				data: {
					pageTitle: 'Ручной эксперимент'
				},
				controller: 'ManualExperimentController',
				controllerAs: 'ctrl'
			})

			.state('auto-experiment', {
				url: "/auto-experiment",
				templateUrl: viewsPrefix + "auto-experiment.html",
				data: {
					pageTitle: 'Автоматизированный эксперимент'
				},
				controller: 'AutoExperimentController',
				controllerAs: 'ctrl'
			})

			.state('around-experiment', {
				url: "/around-experiment",
				templateUrl: viewsPrefix + "around-experiment.html",
				data: {
					pageTitle: 'Эксперимент с обходом'
				},
				controller: 'AroundExperimentController',
				controllerAs: 'ctrl'
			})
	});

angular.module('app').directive('updateTitle', ['$rootScope', '$timeout',
	function ($rootScope, $timeout) {
		return {
			link: function (scope, element) {
				var listener = function (event, toState) {
					var title = 'Перколяция';
					if (toState.data && toState.data.pageTitle) title = toState.data.pageTitle + ' - ' + title;
					$timeout(function () {
						element.text(title);
					}, 0, false);
				};

				$rootScope.$on('$stateChangeSuccess', listener);
			}
		};
	}
]);

angular.module('app')
	.controller('AroundExperimentController', AroundExperimentController)
	.controller('AutoExperimentController', AutoExperimentController)
	.controller('ManualExperimentController', ManualExperimentController);

angular.module('app')
	.factory('clusterFactory', clusterFactory)
	.factory('graphFactory', graphFactory)
	.factory('tableDrawFactory', tableDrawFactory)
	.factory('tableGenerateFactory', tableGenerateFactory);

angular.module('app')
	.animation('.slideAnimation', slideAnimation);