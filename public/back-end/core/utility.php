<?php
    /**
     *  Return true if $str1 and $str2 are equals
     *  @param $str1
     *  @param $str2
     */
    function mStrcmp($str1, $str2) {
        return strcmp($str1, $str2) == 0;
    } // mStrcmp

    /**
     *  Print to log file
     *  @param $str
     */
    function debug($str) {
        if(DEBUG) {
            $logFile = fopen(TMP . '/' . DEBUG_LOG, 'a');
            fwrite($logFile, date('Y-m-d H:i:s') . ' - ' . $str . "\n");
            fclose($logFile);
        } // if
    } // debug

    /**
     *  Dump an array to log file
     *  @param $str
     */
    function debug_r($array) {
        if(DEBUG) {
            file_put_contents(TMP . '/' . DEBUG_LOG, print_r($array, true));
        } // if
    } // debug_r
?>