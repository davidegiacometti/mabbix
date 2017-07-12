(function () {
    'use strict';

    angular
        .module('app.reports')
        .controller('DetailReportController', DetailReportController);

    /** @ngInject */
    function DetailReportController($rootScope, $scope, $state, $stateParams, $mdDialog, $http, $timeout, Settings, MApi) {
        var vm = this;
        var date = new Date();
        // ---
        // MODEL
        // ---
        vm.report = {};
        vm.graphList = [];
        
        // ---
        // METHODS
        // ---
        vm.eventClick = fnEventClick;

        // ---
        // FUNCTIONS
        // ---

        var StopListenReportDetail = activate();

        /**
         * set report number for current user
         */
        function activate() {
            $rootScope.$emit("stateLoadingStart");            
            var stop = $rootScope.$on("reportDetail",
                function (event, param) { 
                    vm.report = param;
                    //console.debug(vm.report);
                    angular.forEach(vm.report.graphs, function (g, k) {
                        MApi.getGraphByID(vm.report.hostId, g)
                            .then(function(data){
                                //console.debug(data);
                                vm.graphList.push(data);
                            });                      
                    });  
                });
            $rootScope.$emit("stateLoadingEnd");
            return stop;
        }//activate

        function fnEventClick(choice) {
            if (choice == "delete") {
                $mdDialog.cancel();
            } else {//confirm
                //$mdDialog.hide(params); //send parameter to functin that invoked dialog
            }//if else
        }//fnEventDb


        $scope.$on("$destroy", function() {
            StopListenReportDetail();
        });

    }//DetailReportController

})();