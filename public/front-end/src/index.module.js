(function () {
  'use strict';

  /**
   * Main module of the Morgana Web Applications
   */
  angular
      .module('morgana', [
          'ui.router',
          'ngMaterial',
          'ngCookies',
          'app', //skeleton
          'app.menubar',
          'app.container',
          'app.login',
          'angular-loading-bar',
          'app.dashboard',
          'app.developer',
          'app.reports',
          'app.configError',
          'app.credits'
      ]);
})();
