(function () {
    'use strict';

    angular
        .module('morgana')
        .factory('Settings', Settings)
        .config(config);
    /* Setup global Settings */

    /** @ngInject */
    function Settings($rootScope, $http, $state, $timeout, $q) {

        var settings = {
            requireLogin: true,
            domain: "localhost",
            version: "0.1.0",
            readConfig: false
        };
        
        toastr.options = {
            "positionClass": "toast-bottom-right",
            "closeButton": true,
            "timeOut": "10000",             //10 sec How long the toast will display without user interaction
            "extendedTimeOut": "20000",     //20 sec How long the toast will display after a user hovers over it
        }
        
        return settings;
    }//Settings

    /** @ngInject */
    function config($mdIconProvider, $mdThemingProvider, $locationProvider) {        
        $mdIconProvider
            // .iconSet('social', 'bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-social.svg', 24)
            // .iconSet('navigation', 'bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-navigation.svg', 24)
            // .iconSet('action', 'bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-action.svg', 24)
            // .iconSet('editor', 'bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-editor.svg', 24)
            // .iconSet('content', 'bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-content.svg', 24)
            // .iconSet('image', 'bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-image.svg', 24)
            // .iconSet('file', 'bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-file.svg', 24)
            // .iconSet('hardware', 'bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-hardware.svg', 50);
            .iconSet('social', './assets/svg-sprite-social.svg', 24)
            .iconSet('navigation', './assets/svg-sprite-navigation.svg', 24)
            .iconSet('action', './assets/svg-sprite-action.svg', 24)
            .iconSet('editor', './assets/svg-sprite-editor.svg', 24)
            .iconSet('content', './assets/svg-sprite-content.svg', 24)
            .iconSet('image', './assets/svg-sprite-image.svg', 24)
            .iconSet('file', './assets/svg-sprite-file.svg', 24)
            .iconSet('hardware', './assets/svg-sprite-hardware.svg', 50);
        
        $mdThemingProvider.theme('dashboard-tile').backgroundPalette('teal').dark();

        /**
         * primaryPalette => title box color, md-primary class
         * accentPalette => color of md-active element, md-button, etc..
         * .backgroundPalette('orange'); => page backgound
         * .warnPalette('red'); => md-warn class
         */
        $mdThemingProvider.theme('default')
            .primaryPalette('teal')
            .accentPalette('amber')
            .warnPalette('red');
    }//config

})();
