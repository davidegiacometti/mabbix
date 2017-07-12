<?php
// Include composer libs
require_once('./lib/vendor/autoload.php');
use \Firebase\JWT\JWT;

abstract class AbstractZabbix {
    private $jwt;

    /**
     *  Default constructor
     */
    public function __construct($jwt = '') {
        $this->jwt = $jwt;
    } // __construct

    /**
     *  Decode the jwt field or throw HTTP 401
     */
    public function jwtDecode() {
        try {
            return JWT::decode($this->jwt, JWT_KEY, array('HS256'));
        } catch (Exception $e) {
            header('HTTP/1.1 401 Unauthorized');
            die();
        } // try-catch
    } // jwtDecode

    /**
     *  Encode the passed jwt
     *  @param $decoded - decoded jwt as object
     */
    public function jwtEncode($decoded) {
        $this->jwt = JWT::encode($decoded, JWT_KEY);
        return $this->jwt;
    } // jwtEncode

    /**
     *  Increment and return the lastId field of the jwt
     */
    public function jwtIncrementId() {
        $decoded = $this->jwtDecode();
        $id = ($decoded->lastId)+1;
        $decoded->lastId = $id;
        $this->jwt = $this->jwtEncode($decoded);
        return $id;
    } // jwtIncrementId

    /**
     *  Return the encoded jwt field
     */
    public function getJwt() {
        return $this->jwt;
    } // getJwt

    /**
     *  Return the auth field of the jwt 
     */
    public function getAuth() {
        $decoded = $this->jwtDecode();
        return $decoded->auth;
    } // getAuth

    /**
     *  Return the username field of the jwt 
     */
    public function getUsername() {
        $decoded = $this->jwtDecode();
        return $decoded->username;
    } // getUsername

    /**
     *  Return the password field of the jwt 
     */
    public function getPassword() {
        $decoded = $this->jwtDecode();
        return $decoded->password;
    } // getUsername

    /**
     *  Permorm a curl request to zabbix api
     *  @param $request - json as string
     */
    private function curl($request) {
        $ch = curl_init(ZABBIX_API_URL);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
        curl_setopt($ch, CURLOPT_POSTFIELDS, $request);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Content-Length: ' . strlen($request)
        ));
        $result = curl_exec($ch);
        $error = curl_error($ch);
        $response = json_decode($result, true);
        curl_close($ch);
        $return['curlError'] = $error;
        $return['zabbixResponse'] = json_decode($result, true);
        return $return;
    } // curl

    /**
     *  Call to zabbix api user.login
     *  @param $user
     *  @param $password
     */
    public function login($user, $password) {
        $request = '{
            "jsonrpc": "2.0",
            "method": "user.login",
            "params": {
                "user": "' . $user . '",
                "password": "' . $password . '"
            },
            "id": 1,
            "auth": null
        }';
        return $this->curl($request);
    } // login

    /**
     *  Call to zabbix api user.logout
     *  @param $auth
     *  @param $id
     */
    public function logout($auth, $id) {
        $request = '{
            "jsonrpc": "2.0",
            "method": "user.logout",
            "params": [],
            "id": ' . $id . ',
            "auth": "' . $auth . '"
        }';
        return $this->curl($request);
    } // logout

    /**
     *  Call to zabbix api host.get
     *  @param $auth
     *  @param $id
     *  @param $hostId = ''
     */
    public function getHost($auth, $id, $hostId = '') {
        if(empty($hostId)) {
            $request = '{
                "jsonrpc": "2.0",
                "method": "host.get",
                "params": {
                    "output": "extend"
                },
                "id": ' . $id . ',
                "auth": "' . $auth . '"
            }';
        } else {
            $request = '{
                "jsonrpc": "2.0",
                "method": "host.get",
                "params": {
                    "output": "extend",
                    "hostids": ["' .  $hostId . '"]
                },
                "id": ' . $id . ',
                "auth": "' . $auth . '"
            }';
        } // if-else
        return $this->curl($request);
    } // getHost
    
    /**
     *  Call to zabbix api graph.get passing an host id
     *  @param $auth
     *  @param $id
     *  @param $hostId = ''
     *  @param $graphId = ''
     */
    public function getGraph($auth, $id, $hostId = '', $graphId = '') {
        $request = '{
            "jsonrpc": "2.0",
            "method": "graph.get",
            "params": {
                "output": "extend",
                "sortfield": "name"';
        if(!empty($hostId)) {
            $request .= ',"hostids": ["' . $hostId . '"]';
        } // if
        if(!empty($graphId)) {
            $request .= ',"graphids": ["' . $graphId . '"]';
        } // if
        $request .= '},
            "id": ' . $id . ',
            "auth": "' . $auth . '"
        }';
        return $this->curl($request);
    } // getGraph

    /**
     *  Call to chart2.php
     *  @param $user -
     *  @param $password -
     *  @param $graphId - 
     *  @param $stime - 
     *  @param $period - 
     *  @param $width - 
     *  @param $height - 
     *  @param $outputSuffix - 
     */
    public function downloadGraph($user, $password, $graphId, $stime, $period, $width, $height, $outputSuffix) {
        debug($outputSuffix);
        $loginData = array('name' => $user, 'password' => $password, 'enter' => 'Sign in');
        $cookie = TMP . '/zabbix_cookie_' . $graphId . '.txt';
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, ZABBIX_INDEX_URL);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_BINARYTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $loginData);
        curl_setopt($ch, CURLOPT_COOKIEJAR, $cookie);
        curl_setopt($ch, CURLOPT_COOKIEFILE, $cookie);
        curl_exec($ch);
        $loginError = curl_error($ch);

        // Call to zabbix login successful
        if(empty($loginError)) {
            $queryString = '?graphid=' . $graphId .'&period=' . $period;
            if(!empty($stime)) {
                $queryString .= '&stime=' . strtotime($stime);
            } // if
            if(!empty($width)) {
                $queryString .= '&width=' . $width;
            } // if
            if(!empty($height)) {
                $queryString .= '&height=' . $height;
            } // if
            debug(ZABBIX_CHART2_URL . $queryString);
            curl_setopt($ch, CURLOPT_URL, ZABBIX_CHART2_URL . $queryString);
            $output = curl_exec($ch);
            $chartError = curl_error($ch);
            curl_close($ch);
            unlink($cookie);

            // Call to chart2.php successful
            if(empty($chartError)) {
                try {
                    $f = fopen(TMP . '/' . $outputSuffix . '_' . $graphId . '.png', 'w');
                    fwrite($f, $output);
                    fclose($f);
                    return TMP . '/' . $outputSuffix . '_' . $graphId . '.png';
                } catch(Exception $e) {
                    debug($e);
                    return false;
                } // try-catch
            } else {
                return false;
            } // if-else
        } else {
            return false;
        } // if-else
    } // downloadGraph
} // AbstractZabbix
?>