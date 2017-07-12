<?php
    define('VERSION', '0.1.0');

    /**
     *  Return the version of the application
     */
    function getVersion() {
        return json_encode(array(
            'status' => true,
            'data' => array(
                'version' => VERSION
            )
        ));
    } // getVersion

    /**
     *  Check if all the required constants are defined and not empty in configuration.php and return a response
     */
    function checkConfiguration() {
        $missingOrEmpty = array();
        if(!defined('ZABBIX_INDEX_URL')) {
            array_push($missingOrEmpty, 'ZABBIX_INDEX_URL');
        } // if
        if(!defined('ZABBIX_API_URL')) {
            array_push($missingOrEmpty, 'ZABBIX_API_URL');
        } // if
        if(!defined('ZABBIX_API_USR')) {
            array_push($missingOrEmpty, 'ZABBIX_API_USR');
        } // if
        if(!defined('ZABBIX_API_PWD')) {
            array_push($missingOrEmpty, 'ZABBIX_API_PWD');
        } // if
        if(!defined('ZABBIX_CHART2_URL')) {
            array_push($missingOrEmpty, 'ZABBIX_CHART2_URL');
        } // if
        if(!defined('DB_ENGINE')) {
            array_push($missingOrEmpty, 'DB_ENGINE');
        } // if
        if(!defined('DB_HOST')) {
            array_push($missingOrEmpty, 'DB_HOST');
        } // if
        if(!defined('DB_PORT')) {
            array_push($missingOrEmpty, 'DB_PORT');
        } // if
        if(!defined('DB_SCHEMA')) {
            array_push($missingOrEmpty, 'DB_SCHEMA');
        } // if
        if(!defined('DB_USR')) {
            array_push($missingOrEmpty, 'DB_USR');
        } // if
        if(!defined('DB_PWD')) {
            array_push($missingOrEmpty, 'DB_PWD');
        } // if
        if(!defined('TMP')) {
            array_push($missingOrEmpty, 'TMP');
        } // if
        if(!defined('DEBUG')) {
            array_push($missingOrEmpty, 'DEBUG');
        } // if
        if(!defined('DEBUG_LOG')) {
            array_push($missingOrEmpty, 'DEBUG_LOG');
        } // if
        if(!defined('JWT_KEY')) {
            array_push($missingOrEmpty, 'JWT_KEY');
        } // if
        if(count($missingOrEmpty) > 0) {
            return json_encode(array(
                'status' => false,
                'data' => array(
                    'invalidConfig' => $missingOrEmpty
                )
            ));
        } else {
            return json_encode(array(
                'status' => true
            ));
        } // if-else
    } // getVersion
?>