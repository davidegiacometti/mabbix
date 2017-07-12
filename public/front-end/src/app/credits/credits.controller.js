(function () {
    'use strict';

    angular
        .module('app.credits')
        .controller('CreditsController', CreditsController);

    /** @ngInject */
    function CreditsController($rootScope, $state, $stateParams, $mdDialog, Settings, MApi) {
        var vm = this;

        // ---
        // MODEL
        // ---
        vm.APIversion = "";
        vm.clientVersion = "";
        // ---
        // METHODS
        // ---
        vm.close = fnClose;

        // ---
        // FUNCTIONS
        // ---

        activate();

        function activate() {
            MApi.getAPIVersion()
                .then(function(response){
                    vm.APIversion = response.version;                    
                });
            vm.clientVersion = Settings.version;
        }//activate

        function fnClose(){
            $mdDialog.cancel();
        }//fnClose

    }//CreditsController

})();

