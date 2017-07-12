(function () {
    'use strict';

    angular
        .module('app.container')
        .controller('ContainerController', ContainerController);

    /** @ngInject */
    function ContainerController($rootScope, $state, $stateParams) {
        var vm = this;

        // ---
        // MODEL
        // ---
        
        // ---
        // METHODS
        // ---        

        // ---
        // FUNCTIONS
        // ---
        
        activate();

        function activate() { }//activate

    }//ContainerController

})();

