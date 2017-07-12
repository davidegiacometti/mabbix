(function () {
    'use strict';

    angular
        .module('app.reports')
        .filter('startFrom', startFrom);

        function startFrom() {
            return function(input, start) {
                start = +start; //parse to int
                return input.slice(start);
            }
        };
})();
