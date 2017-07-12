(function () {
    'use strict';

    angular
        .module('morgana')
        .factory('HttpErrorInterceptor', HttpErrorInterceptor)

    /** @ngInject */
    function HttpErrorInterceptor($q, $rootScope, $timeout) {
        // toastr.options.closeButton = true;
        // toastr.options.timeOut = 10000; //10 sec How long the toast will display without user interaction
        // toastr.options.extendedTimeOut = 20000; //20 sec How long the toast will display after a user hovers over it
        
        var errorAPIManagment = {
            response : function (response) {
                if(response.data.status == false){
                    console.warn("CODE: "+response.status+" REASON: "+response.data.data.error);
                    toastr.error(response.data.data.error, 'Error');
                }
                return $q.resolve(response);
            },
            responseError: function (response) {
                console.warn("CODE: "+response.status+" REASON: "+response.statusText);
                toastr.error(response.statusText, 'Error');
                if(response.status == 401){
                    $rootScope.$emit("forceLoginDueToError");
                }               
                return $q.reject(response);
            }
        };
        return errorAPIManagment;
    } //HttpErrorInterceptor

})();
