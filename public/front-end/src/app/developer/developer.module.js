(function ()
{
    'use strict';

    angular
        .module('app.developer', [
            'ng.jsoneditor'
        ])
        .config(config);
    
        /** @ngInject */
        function config($stateProvider) {
            $stateProvider
                .state('app.developer', {
                    url: 'developer',
                    views: {
                        'content': {
                            templateUrl: 'app/developer/partials/developer.template.html',
                            controller: 'DeveloperController as vm'
                        }
                    }
                })
        }

})();