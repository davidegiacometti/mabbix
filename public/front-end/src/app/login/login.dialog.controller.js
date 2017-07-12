(function () {
    'use strict';

    angular
        .module('app.login')
        .controller('LoginDialogController', LoginDialogController);

    /** @ngInject */
    function LoginDialogController($rootScope, $state, $stateParams, $mdDialog, $http, $cookies, Settings, MApi) {
        var vm = this;

        // ---
        // MODEL
        // ---
        
        // ---
        // METHODS
        // ---
        vm.login = fnLogin;
        
        // ---
        // FUNCTIONS
        // ---

        activate();

        function activate() {
        }//activate

        /**
         * perform login check. if OK emit "login" event to show manubar
         */        
        function fnLogin() {
            MApi.login(vm.username, vm.password)
            .then(function(response){
                var serverResponse = response.data;
                //console.debug(response);
                //console.debug(serverResponse);
                if(serverResponse.status){
                    $rootScope.$emit("login", vm.username);                               //catch by menubar.controller
                    localStorage.user = vm.username;
                    $mdDialog.hide("login");
                }else{
                    console.error(serverResponse.data.error);
                }
            });
        }

    }//LoginDialogController

})();

