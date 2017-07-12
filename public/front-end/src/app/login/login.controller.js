(function () {
    'use strict';

    angular
        .module('app.login')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController($rootScope, $state, $stateParams, $mdDialog, Settings, MApi) {
        var vm = this;

        // ---
        // MODEL
        // ---

        // ---
        // FUNCTIONS
        // ---

        activate();

        function activate() {
            $mdDialog.show({
                controller: "LoginDialogController as vm",
                templateUrl: 'app/login/partials/login.dialog.template.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                escapeToClose: false,
                fullscreen: false // Only for -xs, -sm breakpoints.
            })
                .then(function (answer) {
                    vm.status = 'You said the information was "' + answer + '".';
                }, function () {
                    vm.status = 'You cancelled the dialog.';
                });
        }//activate

    }//LoginController

})();

