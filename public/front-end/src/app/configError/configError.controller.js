(function () {
    'use strict';

    angular
        .module('app.configError')
        .controller('ConfigErrorController', ConfigErrorController);

    /** @ngInject */
    function ConfigErrorController($rootScope, $state, $stateParams, $mdDialog, Settings, MApi) {
        var vm = this;

        // ---
        // MODEL
        // ---
        vm.APIversion = "";
        vm.clientVersion = "";
        vm.errorType = "";
        vm.errorList = {};

        // ---
        // METHODS
        // ---

        vm.reload = fnReload;

        // ---
        // FUNCTIONS
        // ---

        activate();

        function activate() {

            $rootScope.$emit("stateLoadingEnd"); //forced

            $rootScope.$on("invalidConfig",
                function (event, error) {
                    console.debug(error);
                    
                    vm.errorType = error.type;

                    vm.errorList = error.invalidConfig;

                    if(error.type == "BACKEND"){ //if FRONTEND calls to backend doesen't work.. :'(
                        MApi.getAPIVersion()
                            .then(function(response){
                                vm.APIversion = response.version;
                            });
                    }//if error backend

                    vm.clientVersion = Settings.version;

                    //console.debug(vm.report);
                    // angular.forEach(error.invalidConfig, function (error, k) {

                    // });  
                });
        }//activate

        function fnReload(){
            location.reload();
        }//fnReload

    }//ConfigErrorController

})();

