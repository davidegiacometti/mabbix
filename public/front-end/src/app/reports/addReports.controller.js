(function () {
    'use strict';

    angular
        .module('app.reports')
        .controller('AddReportController', AddReportController);

    /** @ngInject */
    function AddReportController($rootScope, $state, $stateParams, $mdDialog, $http, $timeout, Settings, MApi) {
        var vm = this;
        var date = new Date();
        // ---
        // MODEL
        // ---
        vm.period = 3600;
        vm.width = "";
        vm.height = "";
        vm.startDate = date;
        vm.startHour = date.getHours();
        vm.startMinute = 0;
        vm.startSecond = 0;
        vm.emptyStartTime = true;

        vm.avaiableHosts = [];

        vm.avaiableGraphs = [];

        // ---
        // METHODS
        // ---
        vm.eventClick = fnEventClick;
        vm.fixFilterGraph = fixSelectSearchFiled;
        vm.fixFilterHost = fixSelectSearchFiled;
        vm.clearFilterGraphs = function(){
            vm.searchGraph = "";
        }
        vm.clearFilterHosts = function(){
            vm.searchHost = "";
        }
        vm.hostChange = fnHostChange;

        // ---
        // FUNCTIONS
        // ---

        activate();

        /**
         * set report number for current user
         */
        function activate() {

            $rootScope.$emit("stateLoadingStart");
            MApi.getHost().then(function(data){
                //console.debug(data);
                
                angular.forEach(data.hosts, function(value, key) {
                    //console.debug(value);
                    var host = {name: value.host, value: value.hostid}
                    //console.debug(host);
                    vm.avaiableHosts.push(host);
                });
                
                $rootScope.$emit("stateLoadingEnd");
            });
        }//activate

        function fnHostChange() {
            vm.avaiableGraphs = [];
            MApi.getGraph(vm.host).then(function(data){
                angular.forEach(data.graphs, function(value, key) {
                    //console.debug(value);
                    var graph = {name: value.name, value: value.graphid}
                    //console.debug(graph);
                    vm.avaiableGraphs.push(graph);
                });
            });
        }//fnHostChange

        function fnEventClick(choice) {
            if (choice == "delete") {
                $mdDialog.cancel();
            } else {//confirm
                var params = [];
                params.name = vm.name;
                params.host = vm.host;
                var parseHour = vm.startHour < 10 ? "0"+vm.startHour : vm.startHour;
                var parseMinute = vm.startMinute < 10 ? "0"+vm.startMinute : vm.startMinute;
                var parseSecond = vm.startSecond < 10 ? "0"+vm.startSecond : vm.startSecond;
                params.stime = vm.emptyStartTime ? "" : MApi.getDateFromObject(vm.startDate)+" "+parseHour+":"+parseMinute+":"+parseSecond;
                params.period = vm.period;
                params.width = vm.width;
                params.height = vm.height;
                params.graphs = vm.graphs;
                $mdDialog.hide(params); //send parameter to functin that invoked dialog
            }//if else
        }//fnEventDb

        function fixSelectSearchFiled($event){
            $event.stopPropagation();
        }//fixSelectSearchFiled

    }//AddReportController

})();
