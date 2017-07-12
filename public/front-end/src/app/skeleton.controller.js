(function () {
    'use strict';

    angular
        .module('app')
        .controller('SkeletonController', SkeletonController);

    /** @ngInject */
    function SkeletonController($scope, $rootScope, $state, $stateParams, $window, $timeout, $mdDialog, Settings, MApi) {
        var vm = this;

        // ---
        // MODEL
        // ---
        vm.isLoading = true;
        vm.toTop = "";
        vm.version = "";

        // ---
        // METHODS
        // --- 
        vm.scrollTop = fnScrollTop;
        vm.openCredits = fnOpenCredits;

        // ---
        // FUNCTIONS
        // ---

        activate();

        /**
         * @description check if login is required and show login. Listen for start and stop state loading to show loader icon.
         * scolling event to show "go to top" button
         * 
         */
        function activate() {

            if (MApi.checkAppStatus()) {
                showLogin();
            }else{

                if($state.is('app')){
                    $state.go("app.dashboard");
                    $rootScope.$emit("defaultPage");
                }

                // $rootScope.$on("stateReloading",
                //     function (event, state) { 
                //         $state.go(state);
                //     });
            }

            MApi.checkBackendConfig()
                .then(
                    function(response){
                        //console.warn(response);
                        if(!response.status){
                            var errorParam = {
                                type: "BACKEND",
                                invalidConfig: response.data.invalidConfig
                            };                            
                            showConfigError(errorParam);
                        }
                    },
                    function(error){
                        console.debug("error config frontente");
                        var errorParam = {
                                type: "FRONTEND",
                                invalidConfig: ["Couldn't contact API server. Check app config.json: incorrect baseurl or API server down."]
                            }; 
                        showConfigError(errorParam);                        
                    }
                );

            $rootScope.$on("stateLoadingStart",
                function (event, param) { 
                    vm.isLoading = true;
                });
            
            $rootScope.$on("stateLoadingEnd",
                function (event, param) { 
                    vm.isLoading = false;
                });
            
            angular.element($window).bind("scroll", function () {
                if (this.pageYOffset >= 100) {
                    vm.toTop = "scrolling";
                } else {
                    vm.toTop = "";
                }
                $scope.$apply(); //send model changes to scope
            });

            vm.isLoading = false;
        }//activate

        /**
         * @description move on page top
         * 
         */
        function fnScrollTop() {
            jQuery("body").animate({ scrollTop: "0px" }, "fast");
        }//fnScrollTop

        /**
         * @description show login dialog
         * 
         */
        function showLogin(errors) {
            $mdDialog.show({
                controller: "LoginDialogController as vm",
                templateUrl: 'app/login/partials/login.dialog.template.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                escapeToClose: false,
                fullscreen: false // Only for -xs, -sm breakpoints.
            })
                .then(
                function () { //successCallback
                    Settings.requireLogin = false;
                    localStorage.login = true;
                    $state.go("app.dashboard");
                    $rootScope.$emit("defaultPage");
                }, function () {
                    //cancelCallback
                });
        }//showLogin
        
        function showConfigError(invalidConfig){

            function sendError(errors) {
                $timeout(function () {
                    $rootScope.$emit("invalidConfig", errors);
                }, 500);
            }//sendError

            $mdDialog.show({
                controller: "ConfigErrorController as vm",
                templateUrl: 'app/configError/partials/configError.template.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                escapeToClose: false,
                fullscreen: true,
                onComplete: sendError(invalidConfig)
            })
                .then(
                function () {
                    //successCallback                    
                }, function () {
                    //cancelCallback
                });
        }//showConfigError

        function fnOpenCredits(){
            $mdDialog.show({
                controller: "CreditsController as vm",
                templateUrl: 'app/credits/partials/credits.template.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                escapeToClose: true,
                fullscreen: false
            })
            .then(
            function () {
                //successCallback                    
            }, function () {
                //cancelCallback
            });
        }//fnOpenCredits

        $rootScope.$on("forceLoginDueToError",
            function (event) {
                Settings.requireLogin = true;
                localStorage.clear();
                $timeout(function () {
                    location.reload();
                }, 500);                
            });

    }//SkeletonController

})();

