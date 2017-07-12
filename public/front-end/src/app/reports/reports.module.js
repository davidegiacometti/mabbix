(function ()
{
    'use strict';

    angular
        .module('app.reports', [])
        .config(config);
    
        /** @ngInject */
        function config($stateProvider, $mdDateLocaleProvider) {
            $stateProvider
                .state('app.reports', {
                    url: 'reports',
                    views: {
                        'content': {
                            templateUrl: 'app/reports/partials/reports.template.html',
                            controller: 'ReportsController as vm'
                        }
                    }
                });
            
            
            $mdDateLocaleProvider.months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
            //$mdDateLocaleProvider.shortMonths = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
            $mdDateLocaleProvider.days = ['Domenica', 'Lunedi', 'Martedi', 'Mercoledi', 'Giovedi', 'Venerdi', 'Sabato'];
            //$mdDateLocaleProvider.shortDays = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
            $mdDateLocaleProvider.firstDayOfWeek = 1;
            $mdDateLocaleProvider.formatDate = function(date) {
                return moment(date).format('YYYY-MM-DD');
            };
            
        }//config



})();