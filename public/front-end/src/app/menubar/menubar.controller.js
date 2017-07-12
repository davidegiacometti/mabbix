(function () {
    'use strict';

    angular
        .module('app.menubar')
        .controller('MenubarController', MenubarController);

    /** @ngInject */
    function MenubarController($rootScope, $state, $stateParams, $mdSidenav, Settings, MApi) {
        var vm = this;

        // ---
        // MODEL
        // ---
        vm.menuElements = [
            {
                label: "MabbiX",
                name: "dashboard",
                state: "dashboard",
                params: "",
                class: "",
                icon: "action:ic_dashboard_24px", 
            },
            {
                label: "Reports",
                name: "reports",
                state: "reports",
                params: "",
                class: "",
                icon: "editor:ic_show_chart_24px", 
            }
        ];
        vm.showMenu = false;


        // ---
        // METHODS
        // ---
        vm.toggleSidebar = fnToggleSidebar;
        vm.setActive = fnSetActive;
        vm.openMenu = fnOpenMenu;
        vm.logout = fnLogout;

        // ---
        // FUNCTIONS
        // ---
        
        activate();

        /**
         * @description listen for login success action and show menu
         * 
         */
        function activate() {
            $rootScope.$on("login", function (event, user) {
                vm.showMenu = true;
                vm.user = user;            
            });

            $rootScope.$on("defaultPage", function (event, params) { 
                vm.defaultNavItem = "dashboard";
                fnSetActive("dashboard");
            });
            
            $rootScope.$on("reloadPage", function (event, page) { 
                vm.defaultNavItem = page;
                fnSetActive(page);
            });

            if (!MApi.checkAppStatus()) { //login don't required
                vm.showMenu = true;
                vm.defaultNavItem = "dashboard";
                fnSetActive("dashboard");
                if(localStorage.user){
                    vm.user = localStorage.user;                
                } 
            } // if login don't required
        }//activate
        
        /**
         * @description open/close sidebar when click on menu button (for xs-device)
         */
        function fnToggleSidebar() {
            $mdSidenav("left")
                .toggle()
                .then(function () {});
        }//fnToggleSidebar

        /**
         * @description set active class for sidebar element according to user navigation
         * 
         * @param {any} activeName element to set active
         */
        function fnSetActive(activeName) {
            angular.forEach(vm.menuElements, function(item, key) {
                if (activeName == item.name){ 
                    item.class = "active";
                } else {
                    item.class = "";
                }//if
            });
        }//fnSetActive

        var originatorEv;
        function fnOpenMenu($mdMenu, ev){
            originatorEv = ev;
            $mdMenu.open(ev);
        }//fnOpenMenu

        function fnLogout(){
            MApi.logout()
            .then(function(response){
                //$state.go("app");
                location.reload();
            });
        }//fnLogout
    }//MenubarController

})();

