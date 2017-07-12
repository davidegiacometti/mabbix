(function () {
    'use strict';

    angular
        .module('morgana')
        .factory('MApi', MApi)

    /** @ngInject */
    function MApi($rootScope, $http, $timeout, $q, $cookies, Settings) {

        //---
        // INTERNAL FUNCTIONS
        //---

        function setJWT(jwt){
            localStorage.jwt = jwt.replace(/"/g, '');
        }//setJWT

        function getJWT(){
            return localStorage.jwt;
        }//setJWT 


        //---
        // COMMON UTILS
        //---

        /**
         * convert md-datepicker date object
         * @param {Date} dateObj 
         * @return {String} YYYY-MM-DD
         */
        function fnGetDateFromObject(dateObj){
            return (dateObj).getFullYear() + "-" + (("0" + ((dateObj).getMonth() + 1)).slice(-2)) + "-" + (("0" + (dateObj).getDate()).slice(-2));
        }//fnGetDateFromObject

        //---
        // API FUNCTIONS
        //---

        /**
         * 
         * read config.json file and set frontend configuration
         * @returns true if login is required
         */
        function fnCheckAppStatus() {

            var frontendConfigOK = true;

            if(!Settings.readConfig){
                $.ajax({
                    method: "GET",
                    url: "./config.json",
                    //headers: "Content-Type: application/json; charset=utf-8",
                    dataType:"json",
                    async: false
                })
                .done(function( response ) {
                    Settings.baseUrl = response.baseUrl;                    
                    Settings.readConfig = true;
                    frontendConfigOK = true;             
                })
                .fail(function( jqXHR, textStatus ) {
                    console.error(jqXHR);
                    console.error(textStatus);
                    
                    toastr.options.closeButton = true;
                    toastr.options.timeOut = 10000; //10 sec How long the toast will display without user interaction
                    toastr.options.extendedTimeOut = 20000; //20 sec How long the toast will display after a user hovers over it

                    toastr.error("Check config.json file and reload. File not Found", 'Error');

                    frontendConfigOK = false;
                });
            }//!Settings.readConfig

            if(!frontendConfigOK){ return true; }//login required

            if (localStorage.login) {
                Settings.requireLogin = false;
                return false;
            } else {
                return true;
            }

        }//fnCheckAppStatus

        /**
         * 
         * 
         * @param {String} user 
         * @param {String} pwd 
         * @returns 
         */
        function fnAPILogin(user, pwd) {
            //console.debug(user);
            //console.debug(pwd);
            var requestParams = {
                request: 'login',
                user: user,
                password: pwd
            };
            return $http({
                method: 'POST',
                url: Settings.baseUrl,
                data: JSON.stringify(requestParams),
                headers: "Content-Type: application/json"
            })
                .then(
                function successCallback(response) {
                    var mData = response.data;
                    setJWT(JSON.stringify(mData.data.jwt));
                    return response;
                },
                function errorCallback(response) {
                    console.error(response);
                    return response;
                }
                )
                .finally(function () {});
        }//fnAPILogin

        /**
         * 
         */
        function fnGetAPIVersion(){
            var requestParams = {
                request: 'getVersion',
                //jwt: getJWT()
            };
            return $http({
                method: 'POST',
                url: Settings.baseUrl,
                data: JSON.stringify(requestParams),
                headers: "Content-Type: application/json"
            })
                .then(
                function successCallback(response) {
                    var mData = response.data;
                    //setJWT(JSON.stringify(mData.data.jwt));
                    return mData.data;
                },
                function errorCallback(response) {
                    console.error(response);
                    return response;
                }
                )
                .finally(function () {});
        }//fnGetAPIVersion


        /**
         * 
         */
        function fnCheckBackendConfig(){
            var requestParams = {
                request: 'checkConfiguration',
                //jwt: getJWT()
            };
            return $http({
                method: 'POST',
                url: Settings.baseUrl,
                data: JSON.stringify(requestParams),
                headers: "Content-Type: application/json"
            })
                .then(
                function successCallback(response) {
                    var mData = response.data;
                    //setJWT(JSON.stringify(mData.data.jwt));
                    return mData;
                },
                function errorCallback(response) {
                    console.error("checkConfiguration");
                    console.error(response);
                    return $q.reject(response);
                }
                )
                .finally(function () {});
        }//fnCheckBackendConfig

        /**
         * perform logout request and clear local storage
         */
        function fnAPILogout(){
            var requestParams = {
                request: 'logout',
                jwt: getJWT()
            };
            return $http({
                method: 'POST',
                url: Settings.baseUrl,
                data: JSON.stringify(requestParams),
                headers: "Content-Type: application/json"
            })
                .then(
                function successCallback(response) {
                    localStorage.clear();
                    return response;
                },
                function errorCallback(response) {
                    console.error(response);
                    return response;
                }
                )
                .finally(function () {});
        }//fnAPILogout

        /**
         * perform report number request
         */
        function fnAPIGetReport(){
            var requestParams = {
                request: 'getReport',
                jwt: getJWT()
            };
            return $http({
                method: 'POST',
                //method: 'GET',
                url: Settings.baseUrl,
                //url: "app/reports/bozzaGetReport.json",
                data: JSON.stringify(requestParams),
                headers: "Content-Type: application/json"
            })
                .then(
                function successCallback(response) {
                    var mData = response.data;
                    setJWT(JSON.stringify(mData.data.jwt));
                    return mData.data;
                },
                function errorCallback(response) {
                    console.error(response);
                    return response;
                }
                )
                .finally(function () {});
        }//fnAPIReportNumber

        /**
         * perform get host request
         */
        function fnAPIGetHost(){
            var requestParams = {
                request: 'getHost',
                jwt: getJWT()
            };
            return $http({
                method: 'POST',
                url: Settings.baseUrl,
                data: JSON.stringify(requestParams),
                headers: "Content-Type: application/json"
            })
                .then(
                function successCallback(response) {
                    var mData = response.data;
                    setJWT(JSON.stringify(mData.data.jwt));
                    return mData.data;
                },
                function errorCallback(response) {
                    console.error(response);
                    return response;
                }
                )
                .finally(function () {});
        }//fnAPIGetHost
        
        /**
         * 
         * @param {Int} hostID 
         */
        function fnAPIGetHostByID(hostID) {
            var requestParams = {
                request: 'getHost',
                hostid:hostID,
                jwt: getJWT()
            };
            return $http({
                method: 'POST',
                url: Settings.baseUrl,
                data: JSON.stringify(requestParams),
                headers: "Content-Type: application/json"
            })
                .then(
                function successCallback(response) {
                    var mData = response.data;
                    setJWT(JSON.stringify(mData.data.jwt));
                    return mData.data.hosts[0];
                },
                function errorCallback(response) {
                    console.error(response);
                    return response;
                }
                )
                .finally(function () {});
        }//fnAPIGetHostByID

        /**
         * @param {String} host ID
         * perform get graph request
         */
        function fnAPIGetGraph(host){
            var requestParams = {
                request: 'getGraph',
                hostid: host,
                jwt: getJWT()
            };
            return $http({
                method: 'POST',
                url: Settings.baseUrl,
                data: JSON.stringify(requestParams),
                headers: "Content-Type: application/json"
            })
                .then(
                function successCallback(response) {
                    var mData = response.data;
                    setJWT(JSON.stringify(mData.data.jwt));
                    return mData.data;
                },
                function errorCallback(response) {
                    console.error(response);
                    return response;
                }
                )
                .finally(function () {});
        }//fnAPIGetGraph

        /**
         * 
         * @param {Int} host id
         * @param {Int} graphID id
         */
        function fnAPIGetGraphByID(host, graphID){
            var requestParams = {
                request: 'getGraph',
                graphid:graphID,
                hostid: host,
                jwt: getJWT()
            };
            return $http({
                method: 'POST',
                url: Settings.baseUrl,
                data: JSON.stringify(requestParams),
                headers: "Content-Type: application/json"
            })
                .then(
                function successCallback(response) {
                    var mData = response.data;
                    setJWT(JSON.stringify(mData.data.jwt));
                    return mData.data.graphs[0];
                },
                function errorCallback(response) {
                    console.error(response);
                    return response;
                }
                )
                .finally(function () {});
        }//fnAPIGetGraphByID

        /**
         * 
         * @param {Array} param 
         * @description add a report
         */
        function fnAPIAddReport(param){
            var requestParams = {
                request: 'addReport',
                name: param.name,
                stime: param.stime,
                period: param.period,
                width: param.width,
                height: param.height,
                hostId: param.host,
                graphIds: param.graphs,
                jwt: getJWT()
            };
            return $http({
                method: 'POST',
                url: Settings.baseUrl,
                data: JSON.stringify(requestParams),
                headers: "Content-Type: application/json"
            })
                .then(
                function successCallback(response) {
                    var mData = response.data;
                    setJWT(JSON.stringify(mData.data.jwt));
                    return mData.data;
                },
                function errorCallback(response) {
                    console.error(response);
                    return response;
                }
                )
                .finally(function () {});
        }//fnAPIAddReport

        /**
         * 
         * @param {Array} ReportIds 
         * @description delete one or more reports
         */
        function fnAPIDeleteReports(ReportIds) {
            var requestParams = {
                request: 'deleteReport',
                reports: ReportIds,
                jwt: getJWT()
            };
            return $http({
                method: 'POST',
                url: Settings.baseUrl,
                data: JSON.stringify(requestParams),
                headers: "Content-Type: application/json"
            })
                .then(
                function successCallback(response) {
                    var mData = response.data;
                    setJWT(JSON.stringify(mData.data.jwt));
                    if(!mData.status){
                        return $q.defer().reject(mData.status).promise;
                    }else{
                        return mData.data;
                    }
                },
                function errorCallback(response) {
                    console.error(response);
                    return response;
                }
                )
                .finally(function () {});
        }//fnAPIDeleteReports
        
        /**
         * 
         * @param {Array} ReportIds
         * @description download one or more report in .zip archive
         */
        function fnAPIDownloadPNG(ReportIds){
            
            var requestParams = {
                request: 'downloadReportAsPng',
                reports: ReportIds,
                jwt: getJWT()
            };
            //console.debug(requestParams);
            return $http({
                method: 'POST',
                url: Settings.baseUrl,
                data: JSON.stringify(requestParams),
                headers: "Content-Type: application/json"
            })
                .then(
                function successCallback(response) {
                    var mData = response.data;
                    setJWT(JSON.stringify(mData.data.jwt));
                    if(!mData.status){
                        return $q.defer().reject(mData.status).promise;
                    }else{
                        return mData.data;
                    }
                },
                function errorCallback(response) {
                    console.error(response);
                    return response;
                }
                )
                .finally(function () {});
        }//fnAPIDownloadPNG

        /**
         * 
         * @param {Array} ReportIds
         * @description download one or more report in .zip archive
         */
        function fnAPIDownloadPDF(ReportIds){
            
            var requestParams = {
                request: 'downloadReportAsPdf',
                reports: ReportIds,
                jwt: getJWT()
            };
            //console.debug(requestParams);
            return $http({
                method: 'POST',
                url: Settings.baseUrl,
                data: JSON.stringify(requestParams),
                headers: "Content-Type: application/json"
            })
                .then(
                function successCallback(response) {
                    var mData = response.data;
                    setJWT(JSON.stringify(mData.data.jwt));
                    if(!mData.status){
                        return $q.defer().reject(mData.status).promise;
                    }else{
                        return mData.data;
                    }
                },
                function errorCallback(response) {
                    console.error(response);
                    return response;
                }
                )
                .finally(function () {});
        }//fnAPIDownloadPNG

        /**
         * register api
         */
        var api = {
            //Common utils
            getDateFromObject: fnGetDateFromObject,         //(dateObj)

            //app functions
            checkAppStatus: fnCheckAppStatus,               //()

            //API
            login: fnAPILogin,                              //(user,pwd)
            logout: fnAPILogout,                            //()
            getReport: fnAPIGetReport,                      //()
            getHost: fnAPIGetHost,                          //()
            getHostByID:fnAPIGetHostByID,                   //(hostID)
            getGraph: fnAPIGetGraph,                        //(host)
            getGraphByID: fnAPIGetGraphByID,                //(host,graphID)
            addReport: fnAPIAddReport,                      //(param)
            deleteReports: fnAPIDeleteReports,              //(reportIds)
            downloadPng: fnAPIDownloadPNG,                  //(reports) 
            downloadPdf: fnAPIDownloadPDF,                  //(reports) 
            getAPIVersion: fnGetAPIVersion,                 //()
            checkBackendConfig: fnCheckBackendConfig        //()
        }

        return api;
    } //MApi

})();
