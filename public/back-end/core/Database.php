<?php
// Include class AbstractZabbix
require_once('./core/AbstractZabbix.php');

class Database extends AbstractZabbix {

    /**
     *  Rerturn an array with the ids available for the hosts
     */
    private function getHostAsId() {
        $id = $this->jwtIncrementId();
        $return = parent::getHost($this->getAuth(), $id);

        debug(json_encode($return));

        $hosts = array();
        if($return['zabbixResponse']) {
            for($i = 0; $i < count($return['zabbixResponse']['result']); $i++) {
                $hosts[$i] = $return['zabbixResponse']['result'][$i]['hostid'];
            } // for
        } // if
        return $hosts;
    } // getHostAsId

    /**
     *  Rerturn an array with the ids of the graphs of the passed host
     *  @param $hostId = ''
     */
    private function getGraphAsId($hostId = '') {
        $id = $this->jwtIncrementId();
        $return = parent::getGraph($this->getAuth(), $id, $hostId);

        debug(json_encode($return));

        $graphs = array();
        if($return['zabbixResponse']) {
            for($i = 0; $i < count($return['zabbixResponse']['result']); $i++) {
                $graphs[$i] = $return['zabbixResponse']['result'][$i]['graphid'];
            } // for
        } // if
        return $graphs;
    } // getGraphAsId
    
    /**
     *  Return the graph name
     *  @param $graphId - 
     */
    private function getGraphName($graphId) {
        $id = $this->jwtIncrementId();
        $return = parent::getGraph($this->getAuth(), $id, '', $graphId);

        debug(json_encode($return));

        return $return['zabbixResponse']['result'][0]['name'];
    } // getGraphName

    /**
     *  Open the connection to the database
     */
    private function dbOpen() {
        try {
            $dbh = new PDO(DB_ENGINE . ':host=' . DB_HOST . ';dbname=' . DB_SCHEMA, DB_USR, DB_PWD);
            $dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $dbh;
        } catch(PDOException $e) {
            debug($e);
            return false;
        } // try-catch
    } // dbOpen

    /**
     *  Close the connection to the database
     *  @param $dbh - PDO object
     */
    private function dbClose($dbh) {
        unset($dbh);
    } // dbClose

    /**
     *  Return an object with permissions or false if the user doesn't have permissions on passed reports
     *  @param $reports
     *  @param $zId - whether to use zabbix ids
     */
    private function doTheMagic($reports, $zId) {
        $hosts = $this->getHostAsId();
        /* CHECK ON GRAPHS IS PERFORMANCE KILLER!!
        $graphs = $this->getGraphAsId();
        */
        $dbh = $this->dbOpen();
        if($dbh) {
            try {
                // Prepare the IN statement for the reports
                $reportsIn = implode(',', array_fill(0, count($reports), '?'));
                // Prepare the IN statement for the hosts
                $hostsIn = implode(',', array_fill(0, count($hosts), '?'));
                // Prepare the IN statement for the graphs
                /*
                $graphsIn = implode(',', array_fill(0, count($graphs), '?'));
                $reportSelect = 'SELECT r.id AS r_id, r.name, r.stime, r.period, r.width, r.height, h.id AS h_id, h.zabbixId AS h_z_id, g.id AS g_id, g.zabbixId AS g_z_id FROM reports AS r INNER JOIN reports_hosts AS r_h ON r.id = r_h.report_id INNER JOIN hosts AS h ON r_h.host_id = h.id INNER JOIN graphs AS g ON h.id=g.host_id WHERE r.id IN (' . $reportsIn . ') AND h.zabbixId IN (' . $hostsIn . ') AND g.zabbixId IN (' . $graphsIn . ')';
                */
                $reportSelect = 'SELECT r.id AS r_id, r.name, r.stime, r.period, r.width, r.height, h.id AS h_id, h.zabbixId AS h_z_id, g.id AS g_id, g.zabbixId AS g_z_id FROM reports AS r INNER JOIN reports_hosts AS r_h ON r.id = r_h.report_id INNER JOIN hosts AS h ON r_h.host_id = h.id INNER JOIN graphs AS g ON h.id=g.host_id WHERE r.id IN (' . $reportsIn . ') AND h.zabbixId IN (' . $hostsIn . ')';
                $reportStmt = $dbh->prepare($reportSelect);
                // Binding the reports
                $countBind = 1;
                foreach ($reports as $k => $v) {
                    $reportStmt->bindValue($countBind, $v, PDO::PARAM_INT);
                    $countBind += 1;
                } // foreach
                // Binding the hosts
                foreach ($hosts as $k => $v) {
                    $reportStmt->bindValue($countBind, $v, PDO::PARAM_INT);
                    $countBind += 1;
                } // foreach
                // Binding the graphs
                /*
                foreach ($graphs as $k => $v) {
                    $reportStmt->bindValue($countBind, $v, PDO::PARAM_INT);
                    $countBind += 1;
                } // foreach
                */
                $reportStmt->execute();
                $selectedReports = array();
                while ($row = $reportStmt->fetch(PDO::FETCH_ASSOC)) {
                    $rId = $row['r_id'];
                    if(!isset($selectedReports[$rId])) {
                        $selectedReports[$rId] = array(
                            'name' => $row['name'],
                            'stime' => $row['stime'],
                            'period' => $row['period'],
                            'width' => $row['width'],
                            'height' => $row['height'],
                            'hosts' => array(),
                            'graphs' => array()
                        );
                    } // if
                    if($zId) {
                        array_push($selectedReports[$rId]['hosts'], $row['h_z_id']);
                        array_push($selectedReports[$rId]['graphs'], $row['g_z_id']);
                    } else {
                        array_push($selectedReports[$rId]['hosts'], $row['h_id']);
                        array_push($selectedReports[$rId]['graphs'], $row['g_id']);
                    } // if-else
                    $selectedReports[$rId]['hosts'] = array_unique($selectedReports[$rId]['hosts']);
                } // while
                return $selectedReports;
            } catch(PDOException $e) {
                debug($e);
                return false;
            } finally {
                $this->dbClose($dbh);
            } // try-catch-finally
        } else {
            return false;
        } // if-else
    } // doTheMagic

    /**
     *  Add a report in the database
     *  @param $jwt - JWT
     *  @param $name - name of the report
     *  @param $stime - stime field
     *  @param $period - period field
     *  @param $width - width of the graphs
     *  @param $height - height of the graphs
     *  @param $hostId - id of the host
     *  @param $graphIds - array with the ids of the graphs in the report
     */
    public function addReport($name, $stime, $period, $width, $height, $hostId, $graphIds) {
        $hosts = $this->getHostAsId();
        $graphs = $this->getGraphAsId($hostId);
        if(in_array($hostId, $hosts) && empty(array_diff($graphIds, $graphs))) {
            $dbh = $this->dbOpen();
            if($dbh) {
                try {
                    $dbh->beginTransaction();
                    $insertReport = 'INSERT INTO reports (name, stime, period, width, height) VALUES (:name, :stime, :period, :width, :height)';
                    $reportStmt = $dbh->prepare($insertReport);
                    $reportStmt->bindParam(':name', $name, PDO::PARAM_STR);
                    if(!empty($stime)) {
                        $reportStmt->bindParam(':stime', $stime, PDO::PARAM_STR);
                    } else {
                        $reportStmt->bindValue(':stime', null, PDO::PARAM_NULL);
                    } // if
                    $reportStmt->bindParam(':period', $period, PDO::PARAM_INT);
                    if(!empty($width)) {
                        $reportStmt->bindParam(':width', $width, PDO::PARAM_INT);
                    } else {
                        $reportStmt->bindValue(':width', null, PDO::PARAM_NULL);
                    } // if
                    if(!empty($height)) {
                        $reportStmt->bindParam(':height', $height, PDO::PARAM_INT);
                    } else {
                        $reportStmt->bindValue(':height', null, PDO::PARAM_NULL);
                    } // if
                    $reportStmt->execute();
                    $reportDbId = $dbh->lastInsertId();

                    $insertHost = 'INSERT INTO hosts (zabbixId) VALUES (:hostId)';
                    $hostStmt = $dbh->prepare($insertHost);
                    $hostStmt->bindParam(':hostId', $hostId, PDO::PARAM_INT);
                    $hostStmt->execute();
                    $hostDbId = $dbh->lastInsertId();

                    for($i = 0; $i < count($graphIds); $i++) {
                        $insertGraph = 'INSERT INTO graphs (zabbixId, host_id) VALUES (:graphId, ' . $hostDbId . ')';
                        $graphStmt = $dbh->prepare($insertGraph);
                        $graphStmt->bindParam(':graphId', $graphIds[$i], PDO::PARAM_INT);
                        $graphStmt->execute();
                    } // for
                    $dbh->exec('INSERT INTO reports_hosts (report_id, host_id) VALUES (' . $reportDbId . ', ' . $hostDbId . ')');
                    $dbh->commit();
                    return json_encode(array(
                        'status' => true,
                        'data' => array(
                            'jwt' => $this->getJwt()
                        )
                    ));
                } catch(PDOException $e) {
                    debug($e);
                    $dbh->rollback();
                    return json_encode(array(
                    'status' => false,
                    'data' => array(
                        'error' => 'Error inserting data to the database!',
                        'jwt' => $this->getJwt()
                    )
                ));
                } finally {
                    $this->dbClose($dbh);
                } // try-catch-finally
            } else {
                return json_encode(array(
                    'status' => false,
                    'data' => array(
                        'error' => 'Error connecting to the database!',
                        'jwt' => $this->getJwt()
                    )
                ));
            } // if-else
        } else {
            return json_encode(array(
                'status' => false,
                'data' => array(
                    'error' => 'Incorrect data passed!',
                    'jwt' => $this->getJwt()
                )
            ));
        } // if-else
    } // addReport

    /**
     *  Get all the reports from the database or just a single one
     *  @param $reportId = '' - 
     */
    public function getReport($reportId = '') {
        $hosts = $this->getHostAsId();
        $dbh = $this->dbOpen();
        if($dbh) {
            try {
                $reportSelect = 'SELECT r.id AS r_id, r.name, r.stime, r.period, r.width, r.height, h.id AS h_id, h.zabbixId FROM reports AS r INNER JOIN reports_hosts AS r_h ON r.id = r_h.report_id INNER JOIN hosts AS h ON r_h.host_id = h.id WHERE';
                if(!empty($reportId)) {
                    $reportSelect .= ' r.id = :id';
                    $reportSelect .= ' AND';
                } // if
                $reportSelect .= ' h.zabbixId IN (';
                for($i = 0; $i < count($hosts); $i++) {
                    if($i > 0) {
                        $reportSelect .= ', ';
                    } // if
                    $reportSelect .= '"' . $hosts[$i] . '"';
                } // for
                $reportSelect .= ')';
                $reportStmt = $dbh->prepare($reportSelect);
                $reportStmt->bindParam(':id', $reportId, PDO::PARAM_INT);
                $reportStmt->execute();
                $reports = array();
                $i = 0;
                while ($row = $reportStmt->fetch(PDO::FETCH_ASSOC)) {
                    $reports[$i]['id'] = $row['r_id'];
                    $reports[$i]['name'] = $row['name'];
                    $reports[$i]['stime'] = $row['stime'];
                    $reports[$i]['period'] = $row['period'];
                    $reports[$i]['width'] = $row['width'];
                    $reports[$i]['height'] = $row['height'];
                    $reports[$i]['hostId'] = $row['zabbixId'];

                    $graphsSelect = 'SELECT g.zabbixId AS zId FROM graphs AS g INNER JOIN hosts AS h ON g.host_id = h.id WHERE h.id = ' . $row['h_id'] . ';';
                    $graphsStmt = $dbh->prepare($graphsSelect);
                    $graphsStmt->execute();
                    $graphs = array();
                    $j = 0;
                    while ($row = $graphsStmt->fetch(PDO::FETCH_ASSOC)) {
                        $graphs[$j] = $row['zId'];
                        $j += 1;
                    } // while

                    $reports[$i]['graphs'] = $graphs;
                    $i +=1;
                } // while
                return json_encode(array(
                    'status' => true,
                    'data' => array(
                        'reports' => $reports,
                        'jwt' => $this->getJwt()
                    )
                ));
            } catch(PDOException $e) {
                debug($e);
                return json_encode(array(
                    'status' => false,
                    'data' => array(
                        'error' => 'Error retrieving data from the database!',
                        'jwt' => $this->getJwt()
                    )
                ));
            } finally {
                $this->dbClose($dbh);
            } // try-catch-finally
        } else {
            return json_encode(array(
                'status' => false,
                'data' => array(
                    'error' => 'Error connecting to the database!',
                    'jwt' => $this->getJwt()
                )
            ));
        } // if-else
    } // getReport

    /**
     *  Delete one or more reports from the database
     *  @param $reports
     */
    public function deleteReport($reports) {
        $hosts = $this->getHostAsId();
        $dbh = $this->dbOpen();
        if($dbh) {
            try {
                $dbh->beginTransaction();
                $inQuery = implode(',', array_fill(0, count($hosts), '?'));
                $reportSelect = 'SELECT r.id AS r_id, h.id AS h_id, h.zabbixId FROM reports AS r INNER JOIN reports_hosts AS r_h ON r.id = r_h.report_id INNER JOIN hosts AS h ON r_h.host_id = h.id WHERE h.zabbixId IN (' . $inQuery . ')';
                $reportStmt = $dbh->prepare($reportSelect);
                foreach ($hosts as $k => $v) {
                    $reportStmt->bindValue(($k + 1), $v, PDO::PARAM_INT);
                } // foreach
                $reportStmt->execute();
                $selectedReports = array();
                $selectedHosts = array();
                while ($row = $reportStmt->fetch(PDO::FETCH_ASSOC)) {
                    $rId = $row['r_id'];
                    array_push($selectedReports, $rId);
                    if(in_array($rId, $reports)) {
                         array_push($selectedHosts, $row['h_id']);
                    } // if
                } // while
                $selectedReports = array_unique($selectedReports);
                if(empty(array_diff($reports, $selectedReports))) {
                    $inReportsDelete = implode(',', array_fill(0, count($reports), '?'));
                    $deleteReport = 'DELETE FROM reports WHERE reports.id IN (' . $inReportsDelete . ')';
                    $deleteReportsStmt = $dbh->prepare($deleteReport);
                    foreach ($reports as $k => $v) {
                        $deleteReportsStmt->bindValue(($k + 1), $v, PDO::PARAM_INT);
                    } // foreach
                    $deleteReportsStmt->execute();

                    $inHostsDelete = implode(',', array_fill(0, count($selectedHosts), '?'));
                    $deleteHosts = 'DELETE FROM hosts WHERE hosts.id IN (' . $inHostsDelete . ')';
                    $deleteHostsStmt = $dbh->prepare($deleteHosts);
                    foreach ($selectedHosts as $k => $v) {
                        $deleteHostsStmt->bindValue(($k + 1), $v, PDO::PARAM_INT);
                    } // foreach
                    $deleteHostsStmt->execute();
                    $dbh->commit();
                    return json_encode(array(
                        'status' => true,
                        'data' => array(
                            'jwt' => $this->getJwt()
                        )
                    ));
                } else {
                    return json_encode(array(
                        'status' => false,
                        'data' => array(
                            'error' => 'Incorrect data passed!',
                            'jwt' => $this->getJwt()
                        )
                    ));
                } // if-else
                return json_encode(array(
                    'status' => true,
                    'data' => array(
                        'jwt' => $this->getJwt()
                    )
                ));
            } catch(PDOException $e) {
                debug($e);
                $dbh->rollback();
                return json_encode(array(
                    'status' => false,
                    'data' => array(
                        'error' => 'Error deleting data from the database!',
                        'jwt' => $this->getJwt()
                    )
                ));
            } finally {
                $this->dbClose($dbh);
            } // try-catch-finally
        } else {
            return json_encode(array(
                'status' => false,
                'data' => array(
                    'error' => 'Error connecting to the database!',
                    'jwt' => $this->getJwt()
                )
            ));
        } // if-else
    } // deleteReport

    /**
     *  [Description]
     *  @param $reports
     *  @param $format - png or pdf
     */
    function downloadReport($reports, $format) {
        $magic = $this->doTheMagic($reports, true);
        debug_r($magic);
        $archive = tempnam(TMP, 'morgana_');
        $zip = new ZipArchive();
        if ($zip->open($archive, ZipArchive::CREATE | ZipArchive::OVERWRITE)) {
            for($i = 0; $i < count($reports); $i++) {
                $name = date('YmdHis') . '.zip';
                $stime = $magic[$reports[$i]]['stime'];
                $period = $magic[$reports[$i]]['period'];
                $width = $magic[$reports[$i]]['width'];
                $height = $magic[$reports[$i]]['height'];
                $html = '';
                for($j = 0; $j < count($magic[$reports[$i]]['graphs']); $j++) {
                    $graphId = $magic[$reports[$i]]['graphs'][$j];
                    $graphName = $this->getGraphName($graphId);
                    $graphFile = parent::downloadGraph($this->getUsername(), $this->getPassword(), $graphId, $stime, $period, $width, $height, end(explode('/', $archive)));
                    if(mStrCmp($format, 'png')) {
                        $zip->addFile($graphFile, $magic[$reports[$i]]['name'] . '/' . mb_ereg_replace("([^\w\s\d\-_~,;\[\]\(\).])", '', str_replace('/', '-', $graphName)) . '.png');
                    } else {
                        $html .= '<p><img src="' . $graphFile . '" style="width:100%; border:1px solid #000000" /></p>';
                    } // if-else
                } // for-j
                if(mStrCmp($format, 'pdf')) {
                    $pdfFile = TMP . '/' . $magic[$reports[$i]]['name'] . '.pdf';
                    $mPdf = new mPDF();
                    $mPdf->SetCompression(false);
                    $mPdf->setFooter('|Page {PAGENO}/{nb}');
                    $mPdf->WriteHTML($html);
                    $mPdf->Output($pdfFile, 'F');
                    $zip->addFile($pdfFile, end(explode('/', $pdfFile)));
                } // if
            } // for-i
            $zip->close();
            for($i = 0; $i < count($reports); $i++) {
                for($j = 0; $j < count($magic[$reports[$i]]['graphs']); $j++) {
                    $graphId = $magic[$reports[$i]]['graphs'][$j];
                    unlink(TMP . '/' . $graphId . '.png');
                } // for-j
            } // for-i
            $base64 = base64_encode(file_get_contents($archive));
            $mimetype = mime_content_type($archive);
            return json_encode(array(
                'status' => true,
                'data' => array(
                    'jwt' => $this->getJwt(),
                    'output' => $base64,
                    'mimetype' => $mimetype,
                    'name' => $name
                )
            ));
        } else {
            return json_encode(array(
                'status' => false,
                'data' => array(
                    'jwt' => $this->getJwt()
                )
            ));
        } // if-else
    } // downloadReport
} // Database
?>