(function ()
{
    'use strict';

    angular
        .module('app', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $httpProvider) {
        // State
        $stateProvider
            .state('app', {
                url: '/',
                views: {
                    'skeleton': {
                        templateUrl: 'app/skeleton.template.html',
                        controller: 'SkeletonController as vm'
                    },
                    'menubar@app': {
                        templateUrl: 'app/menubar/partials/menubar.template.html',
                        controller: 'MenubarController as vm'
                    },
                    'container@app': {
                        templateUrl: 'app/container/partials/container.template.html',
                        controller: 'ContainerController as vm'
                    },
                }
            });

        $httpProvider.interceptors.push('HttpErrorInterceptor');

    }// config

})();