(function () {
    'use strict';

    angular
        .module('app.reports')
        .controller('ReportsController', ReportsController);

    /** @ngInject */
    function ReportsController($rootScope, $state, $stateParams, $mdDialog, $http, $timeout, Settings, MApi) {
        var vm = this;

        // ---
        // MODEL
        // ---
        vm.reportsList = [];
        vm.currentPage = 0;
        vm.pageSize = 10;
        vm.pageLengths = [5, 10, 15, 20, 30];
        vm.multiselect = [];
        vm.isMultiActionOpen = false;

        // ---
        // METHODS
        // ---
        vm.addReport = fnAddReport;
        vm.detail = fnDetail;
        vm.delete = fnDelete;
        vm.numberOfPages = fnNumberOfPages;
        vm.showingInfoPagination = fnShowingInfoPagination;
        vm.toggle = fnToggle;
        vm.png = fnPNG;
        vm.pdf = fnPDF;

        // ---
        // FUNCTIONS
        // ---

        activate();

        // BEGIN PAGINATION FUCTION

        function fnNumberOfPages(){
            return Math.ceil(vm.reportsList.length/vm.pageSize);
        }//fnNumberOfPages

        function fnShowingInfoPagination(){
            return vm.pageSize*(vm.currentPage+1) > vm.reportsList.length ? vm.reportsList.length : vm.pageSize*(vm.currentPage+1);
        }//fnShowingInfoPagination
        
        // END PAGINATION FUCTION

        /**
         * @description flag/unflag report checkbox. if checked add report id to checked list, otherwise remove from list
         * @param {Int} item - report id
         * @param {*} list - checked elements
         */
        function fnToggle(item, list){           
            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
            }
            else {
                list.push(item);
            }
        }//fnToggle


        /**
         * @description get report list and host name
         */
        function fnGetReportList(){
            $rootScope.$emit("stateLoadingStart");

            vm.reportsList = [];
            vm.multiselect = [];
            
            MApi.getReport()
                .then(
                    function (data) {
                        vm.reportsList = data.reports;
                        angular.forEach(vm.reportsList, function (r, k) {
                            MApi.getHostByID(r.hostId)
                                .then(function(hostData){
                                    // console.debug(hostData.host);
                                    // console.debug();
                                    vm.reportsList[k].host = hostData.host;
                                });                            
                        });
                        $rootScope.$emit("stateLoadingEnd");
                    }
                );
        }//fnGetReportList

        /**
         * @description get report list
         */
        function activate() {
            if (MApi.checkAppStatus()) {
                $state.go("app");
            } else {
                $rootScope.$emit("reloadPage", "reports");
                fnGetReportList();
            }//if else
        }//activate
        
        /**
         * @description add a report
         */
        function fnAddReport() {
            $mdDialog.show({
                controller: "AddReportController as vm",
                templateUrl: 'app/reports/partials/addReports.dialog.template.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                escapeToClose: true,
                fullscreen: false // Only for -xs, -sm breakpoints.
            })
                .then(
                function (param) {
                    //console.warn(param);
                    
                    MApi.addReport(param)//add report API
                        .then(function (response) {
                            
                            fnGetReportList();
                            toastr.success(param.name + "created successfully");
                        });//add report
                },// confirm dialog

                function () { }//cancel
                );
        }//fnAddReport
        
        /**
         * @description get single report by id from report list
         * @param {Int} reportID 
         * @returns report object from vm.reportList by ReportID
         */
        function getReportById(reportID) {
            var report = {};
            angular.forEach(vm.reportsList, function (r, k) {
                if (r.id == reportID) {
                    report = r;
                    return;         //stop forEach
                }
            });
            return report;
        }//getReportById

        /**
         * @description show detail template dialog
         * @param {Int} id - report id 
         */
        function fnDetail(id) {

            /**
             * @description internal function. send report object to open detail dialog. Delay needed.
             * @param {Report} report 
             */
            function sendParameters(report) {
                $timeout(function () {
                    $rootScope.$emit("reportDetail", report);
                }, 100);
            }//sendParameters

            var r = getReportById(id);

            /**
             * delete report dialog
             */
            $mdDialog.show({
                controller: "DetailReportController as vm",
                templateUrl: 'app/reports/partials/detailReports.dialog.template.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                escapeToClose: true,
                fullscreen: false, // Only for -xs, -sm breakpoints.
                onComplete: sendParameters(r)
            })
                .then(
                function (param) {
                },
                function () { }//cancel
                );
        }//fnDetail

        /**
         * 
         * @description delete one or more report(s)
         * @param {event} event onclick
         * @param {Any} ids single or array report ids  
         * @param {Boolean} isMultiple true if delete call from multiselect, false otherwise
         */
        function fnDelete($event, ids, isMultiple) {
            var confirm = null;
            if(!isMultiple){
                var r = getReportById(ids);
                ids = [ids];                    //API nedded array
                confirm = $mdDialog.confirm()
                    .title('Delete '+r.name)
                    .textContent('Confirm?')
                    .ariaLabel('Delete')
                    .targetEvent($event)
                    .ok('Yes')
                    .cancel('No');
            }else{
                // ids already array
                confirm = $mdDialog.confirm()
                    .title('Delete selected Reports')
                    .textContent('Confirm?')
                    .ariaLabel('Delete selected Reports')
                    .targetEvent($event)
                    .ok('Yes')
                    .cancel('No');
            }

            $mdDialog.show(confirm).then(
                function () {//OK
                    MApi.deleteReports(ids)
                        .then(
                            function(response){                                
                                fnGetReportList();
                                toastr.success("Report deleted");
                            },
                            function(){}
                        );
                }, 
                function () {}//CANCEL
            );
        }//fnDetail

        /**
         * @description download zip archive with host's graph selected in current report
         * @param {Object} reportsId One or more report Ids. if more Object is array
         */
        function fnPNG(reportsId, isMultiple){
            $rootScope.$emit("stateLoadingStart");
            
            if(!isMultiple){
                reportsId = [reportsId];
            }

            MApi.downloadPng(reportsId)
                .then(
                    function(response){                                
                        //console.debug(response);
                        $mdDialog.show({
                            controller: function DialogController($scope, $mdDialog) {
                                            $scope.closeDialog = function() {
                                                $mdDialog.cancel();
                                            }
                                        },
                            template:
                                '<md-dialog aria-label="download png report">'+
                                '   <md-toolbar>'+
                                '       <div class="md-toolbar-tools">'+
                                '           <h2>Download</h2>'+
                                '           <span flex></span>'+
                                '           <md-button class="md-icon-button" ng-click="closeDialog()">'+
                                '           <md-icon md-svg-src="content:ic_clear_24px" aria-label="close"></md-icon>'+
                                '           </md-button>'+
                                '       </div>'+
                                '   </md-toolbar>'+
                                '   <md-dialog-content>'+
                                '       <div class="md-dialog-content dialog-download-report">'+
                                '           <p>The file is available, follow the link above and enjoy!</p>'+
                                '           <p><a href="data:'+response.mimetype+';base64,'+response.output+'" download="'+response.name+'" class="md-raised md-primary"><md-icon md-svg-src="content:ic_archive_24px" aria-label="archive" class="md-raised md-primary"></md-icon> '+response.name+'</a></p>'+
                                '       </div>'+
                                '   </md-dialog-content>'+
                                '</md-dialog>',
                            
                            parent: angular.element(document.body),                            
                            clickOutsideToClose:true
                        });
                        $rootScope.$emit("stateLoadingEnd");
                    },
                    function(){}
                );
        }//fnPNG

        /**
         * @description download zip archive with host's graph selected in current report
         * @param {Object} reportsId One or more report Ids. if more Object is array
         */
        function fnPDF(reportsId, isMultiple){
            $rootScope.$emit("stateLoadingStart");
            
            if(!isMultiple){
                reportsId = [reportsId];
            }

            MApi.downloadPdf(reportsId)
                .then(
                    function(response){                                
                        //console.debug(response);
                        $mdDialog.show({
                            controller: function DialogController($scope, $mdDialog) {
                                            $scope.closeDialog = function() {
                                                $mdDialog.cancel();
                                            }
                                        },
                            template:
                                '<md-dialog aria-label="download pdf report">'+
                                '   <md-toolbar>'+
                                '       <div class="md-toolbar-tools">'+
                                '           <h2>Download</h2>'+
                                '           <span flex></span>'+
                                '           <md-button class="md-icon-button" ng-click="closeDialog()">'+
                                '           <md-icon md-svg-src="content:ic_clear_24px" aria-label="close"></md-icon>'+
                                '           </md-button>'+
                                '       </div>'+
                                '   </md-toolbar>'+
                                '   <md-dialog-content>'+
                                '       <div class="md-dialog-content dialog-download-report">'+
                                '           <p>The file is available, follow the link above and enjoy!</p>'+
                                '           <p><a href="data:'+response.mimetype+';base64,'+response.output+'" download="'+response.name+'" class="md-raised md-primary"><md-icon md-svg-src="content:ic_archive_24px" aria-label="archive" class="md-raised md-primary"></md-icon> '+response.name+'</a></p>'+
                                '       </div>'+
                                '   </md-dialog-content>'+
                                '</md-dialog>',
                            
                            parent: angular.element(document.body),                            
                            clickOutsideToClose:true
                        });
                        $rootScope.$emit("stateLoadingEnd");
                    },
                    function(){}
                );
        }//fnPNG

    }//ReportsController

})();
