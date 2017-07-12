<?php
// For cross domain requests
if($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    die();
} // if

// Set the response as json
header("Content-Type: application/json");

// Include configuration.php
require_once('./core/configuration.php');
// Include utility.php
require_once('./core/utility.php');

// Include Morgana.php
require_once('./core/Morgana.php');

// Include Zabbix class
require_once('./core/Zabbix.php');

// Include Database class
require_once('./core/Database.php');

// Check if configuration.php doesn't exists
if(!file_exists('./core/configuration.php')) {
    header('HTTP/1.1 500 Internal Server Error');
    die();
} // if

// Read request payload
$params = json_decode(file_get_contents('php://input'), false);

debug(json_encode($params));

// Check if the request isn't valid
if(!(isset($params->request) && !empty($params->request))) {
    header('HTTP/1.1 400 Bad Request');
    die();
} // if

// login
if(mStrcmp($params->request, 'login') && isset($params->user) && isset($params->password) && !empty($params->user) && !empty($params->password)) {
    // Initialize a Zabbix object
    $z = new Zabbix();

    print $z->login($params->user, $params->password);
    die();
} elseif(mStrcmp($params->request, 'getVersion')) {
    print getVersion();
    die();
} elseif(mStrcmp($params->request, 'checkConfiguration')) {
    print checkConfiguration();
    die();
} // if-else

// Check if jwt is passed
if(isset($params->jwt)) {
    // Initialize a Zabbix object
    $z = new Zabbix($params->jwt);

    // Initialize a Database object
    $d = new Database($params->jwt);

    // logout
    if(mStrcmp($params->request, 'logout')) {
        print $z->logout();
        die();

    // addReport
    } elseif(mStrcmp($params->request, 'addReport') && isset($params->name) && isset($params->stime) && isset($params->period) && isset($params->width) && isset($params->height) && isset($params->hostId) && isset($params->graphIds)) {
        print $d->addReport($params->name, $params->stime, $params->period, $params->width, $params->height, $params->hostId, $params->graphIds);
        die();

    // getReport
    } elseif(mStrcmp($params->request, 'getReport')) {
        if (isset($params->reportId)) {
            print $d->getReport($params->reportId);
            die();
        } else {
            print $d->getReport();
            die();
        } // if-else

    // deleteReport
    } elseif(mStrcmp($params->request, 'deleteReport') && isset($params->reports)) {
        print $d->deleteReport($params->reports);
        die();

    // downloadReportAsPng
    } elseif(mStrcmp($params->request, 'downloadReportAsPng') && isset($params->reports)) {
        print $d->downloadReport($params->reports, 'png');
        die();

    // downloadReportAsPdf
    } elseif(mStrcmp($params->request, 'downloadReportAsPdf') && isset($params->reports)) {
        print $d->downloadReport($params->reports, 'pdf');
        die();   

    // AJAX oriented requests

    // getHost
    } elseif(mStrcmp($params->request, 'getHost')) {
        // hostid
        if (isset($params->hostid)) {
            print $z->getHost($params->hostid);
            die();
        } else {
            print $z->getHost();
            die();
        } // if-else

    // getGraph
    } elseif(mStrcmp($params->request, 'getGraph') && isset($params->hostid)) {
        // graphid
        if (isset($params->graphid)) {
            print $z->getGraph($params->hostid, $params->graphid);
            die();
        } else {
            print $z->getGraph($params->hostid);
            die();
        } // if-else
    } // if-else
} // if

// If the request is invalid
header('HTTP/1.1 400 Bad Request');
die();
?>