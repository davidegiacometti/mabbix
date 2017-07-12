(function ()
{
    'use strict';

    angular
        .module('app.login', [])
        .config(config);
    
        /** @ngInject */
        function config($stateProvider) {
            // State
            // $stateProvider
            //     .state('app.login', {
            //         url: 'login',
            //         views: {
            //             'content': {
            //                 templateUrl: 'app/login/partials/login.template.html',
            //                 controller: 'LoginController as vm'
            //             }
            //         }
            //     })
        }

})();