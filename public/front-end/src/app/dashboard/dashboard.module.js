(function ()
{
    'use strict';

    angular
        .module('app.dashboard', [])
        .config(config);
    
        /** @ngInject */
        function config($stateProvider) {
            $stateProvider
                .state('app.dashboard', {
                    url: 'dashboard',
                    views: {
                        'content': {
                            templateUrl: 'app/dashboard/partials/dashboard.template.html',
                            controller: 'DashboardController as vm'
                        }
                    }
                })
        }

})();