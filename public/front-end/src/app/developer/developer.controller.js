(function () {
    'use strict';

    angular
        .module('app.developer')
        .controller('DeveloperController', DeveloperController);

    /** @ngInject */
    function DeveloperController($rootScope, $state, $stateParams, $mdDialog, $http, Settings, MApi) {
        var vm = this;

        // ---
        // MODEL
        // ---
        var json = {"jwt": localStorage.jwt, "request":""};

        vm.url = Settings.baseUrl;
        vm.method = "POST";
        vm.request = {
            data: json,
            options: { 
                mode: 'code'
            }
        };

        vm.response = {
            data: {},
            options: { 
                mode: 'code'
            }
        };

        // ---
        // METHODS
        // ---
        vm.switchView = fnSwitchView;
        vm.testAPI = fnTestAPI;
        
        // ---
        // FUNCTIONS
        // ---

        activate();

        function activate() {
            $rootScope.$emit("stateReloading", "app.developer");
            $mdDialog.cancel();
        }//activate

        function fnSwitchView(type) {
            if(type == "request")
                vm.request.options.mode = vm.request.options.mode == 'tree' ? 'code' : 'tree';
            else
                vm.response.options.mode = vm.response.options.mode == 'tree' ? 'code' : 'tree';            
        }//fnSwitchView

        function fnTestAPI(){
            //vm.request.data["jwt"] =  localStorage.jwt;
            var allContent = angular.toJson(vm.request.data, true);
            $http({
                method: vm.method,
                url: vm.url,
                data: allContent,
                headers: "Content-Type: application/json"
            })
                .then(
                function successCallback(response) {
                    console.debug(response);
                    vm.rawResponse = response;
                    vm.response.data = response;
                },
                function errorCallback(response) {
                    console.error(response);
                    vm.rawResponse = response;
                    vm.response.data = response;
                }
                )
                .finally(function () {
                    
                });
        }//fnTest

    }//DeveloperController

})();
