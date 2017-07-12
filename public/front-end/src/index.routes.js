(function () {
    'use strict';
    angular
        .module('morgana')
        .config(routesConfig);

    /** @ngInject */
    function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode({
            enabled: false,
            requireBase: false
        }).hashPrefix('!');
        //$locationProvider.html5Mode(true).hashPrefix('!');
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('root', {
                url: '/',
                component: 'app'
            });
    }
})();