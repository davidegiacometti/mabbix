(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    /** @ngInject */
    function DashboardController($rootScope, $state, $stateParams, $mdDialog, $http, $timeout, Settings, MApi) {
        var vm = this;

        // ---
        // MODEL
        // ---
        vm.user = localStorage.user;
        vm.reportsNumber = 0;
        // ---
        // METHODS
        // ---
                
        // ---
        // FUNCTIONS
        // ---

        activate();

        /**
         * set report number for current user
         */
        function activate() {
            
            if (MApi.checkAppStatus()){ 
                $state.go("app");
            }else{
                $rootScope.$emit("stateReloading", "app.dashboard");
                $rootScope.$emit("stateLoadingStart");
                MApi.getReport()
                    .then(
                        function(data){
                            vm.reportsNumber = data.reports.length;
                            $rootScope.$emit("stateLoadingEnd");
                        }
                    );
            }
        }//activate
        
    }//DashboardController

})();
