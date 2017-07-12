<?php
// Include class AbstractZabbix
require_once('./core/AbstractZabbix.php');

class Zabbix extends AbstractZabbix {

    /**
     *  Call to zabbix api user.login
     *  @param $user
     *  @param $password
     */
    public function login($user, $password) {
        $return = parent::login($user, $password);

        debug(json_encode($return));

        if($return['zabbixResponse']) {
            if(isset($return['zabbixResponse']['result'])) {
                $time = time();
                $token = array(
                    'iss' => $_SERVER['SERVER_NAME'],
                    'iat' => $time,
                    'nbf' => $time,
                    'username' => $user,
                    'password' => $password,
                    'auth' => $return['zabbixResponse']['result'],
                    'lastId' => 1
                );
                $jwt = $this->jwtEncode($token);
                return json_encode(array(
                    'status' => true,
                    'data' => array(
                        'jwt' => $jwt
                    )
                ));
            } elseif(isset($return['zabbixResponse']['error'])) {
                return json_encode(array(
                    'status' => false,
                    'data' => array(
                        'error' => $return['zabbixResponse']['error']['data'],
                        'jwt' => $this->getJwt()
                    )
                ));
            } else {
                return json_encode(array(
                    'status' => false,
                    'data' => array(
                        'error' => 'Ooops! :( Something went wrong... Zabbix is crazy!',
                        'jwt' => $this->getJwt()
                    )
                ));
            } // if-else
        } else {
            return json_encode(array(
                'status' => false,
                'data' => array(
                    'error' => $return['curlError'],
                    'jwt' => $this->getJwt()
                )
            ));
        } // if-else
    } // login

    /**
     *  Call to zabbix api user.logout
     */
    public function logout() {
        $decoded = $this->jwtDecode();
        $id = $this->jwtIncrementId();
        $return = parent::logout($this->getAuth(), $id);

        debug(json_encode($return));

        if($return['zabbixResponse']) {
            if(isset($return['zabbixResponse']['result'])) {
                return json_encode(array(
                    'status' => true,
                ));
            } elseif(isset($return['zabbixResponse']['error'])) {
                return json_encode(array(
                    'status' => false,
                    'data' => array(
                        'error' => $return['zabbixResponse']['error']['data'],
                        'jwt' => $this->getJwt()
                    )
                ));
            } else {
                return json_encode(array(
                    'status' => false,
                    'data' => array(
                        'error' => 'Ooops! :( Something went wrong... Zabbix is crazy!',
                        'jwt' => $this->getJwt()
                    )
                ));
            } // if-else.
        } else {
            return json_encode(array(
                'status' => false,
                'data' => array(
                    'error' => $return['curlError'],
                    'jwt' => $this->getJwt()
                )
            ));
        } // if-else
    } // logout

    /**
     *  Return the hosts available for the user or just the specific hostId
     *  @param $hostId = ''
     */
    public function getHost($hostId = '') {
        $decoded = $this->jwtDecode();
        $id = $this->jwtIncrementId();
        $return = parent::getHost($this->getAuth(), $id, $hostId);

        debug(json_encode($return));

        if($return['zabbixResponse']) {
            if(isset($return['zabbixResponse']['result'])) {
                $hosts = array();
                for($i = 0; $i < count($return['zabbixResponse']['result']); $i++) {
                    $hosts[$i]['hostid'] = $return['zabbixResponse']['result'][$i]['hostid'];
                    $hosts[$i]['host'] = $return['zabbixResponse']['result'][$i]['host'];
                } // for

                return json_encode(array(
                    'status' => true,
                    'data' => array(
                        'hosts' => $hosts,
                        'jwt' => $this->getJwt()
                    )
                ));
            } elseif(isset($return['zabbixResponse']['error'])) {
                return json_encode(array(
                    'status' => false,
                    'data' => array(
                        'error' => $return['zabbixResponse']['error']['data'],
                        'jwt' => $this->getJwt()
                    )
                ));
            } else {
                return json_encode(array(
                    'status' => false,
                    'data' => array(
                        'error' => 'Ooops! :( Something went wrong... Zabbix is crazy!',
                        'jwt' => $this->getJwt()
                    )
                ));
            } // if-else
        } else {
            return json_encode(array(
                'status' => false,
                'data' => array(
                    'error' => $return['curlError'],
                    'jwt' => $this->getJwt()
                )
            ));
        } // if-else
    } // getHost

    /**
     *  Return the graphs of the passed host or just the specific graphId
     *  @param $hostId = ''
     *  @param $graphId = ''
     */
    public function getGraph($hostId = '', $graphId = '') {
        $decoded = $this->jwtDecode();
        $id = $this->jwtIncrementId();
        $return = parent::getGraph($this->getAuth(), $id, $hostId, $graphId);

        debug(json_encode($return));

        if($return['zabbixResponse']) {
            if(isset($return['zabbixResponse']['result'])) {
                $graphs = array();
                for($i = 0; $i < count($return['zabbixResponse']['result']); $i++) {
                    $graphs[$i]['graphid'] = $return['zabbixResponse']['result'][$i]['graphid'];
                    $graphs[$i]['name'] = $return['zabbixResponse']['result'][$i]['name'];
                } // for

                return json_encode(array(
                    'status' => true,
                    'data' => array(
                        'graphs' => $graphs,
                        'jwt' => $this->getJwt()
                    )
                ));
            } elseif(isset($return['zabbixResponse']['error'])) {
                return json_encode(array(
                    'status' => false,
                    'data' => array(
                        'error' => $return['zabbixResponse']['error']['data'],
                        'jwt' => $this->getJwt()
                    )
                ));
            } else {
                return json_encode(array(
                    'status' => false,
                    'data' => array(
                        'error' => 'Ooops! :( Something went wrong... Zabbix is crazy!',
                        'jwt' => $this->getJwt()
                    )
                ));
            } // if-else
        } else {
            return json_encode(array(
                'status' => false,
                'data' => array(
                    'error' => $return['curlError'],
                    'jwt' => $this->getJwt()
                )
            ));
        } // if-else
    } // getGraph
} // Zabbix
?>