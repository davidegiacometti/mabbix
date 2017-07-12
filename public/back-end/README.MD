Backend API documentation
=========================

This is the documentation of the backend API. Every call is made using **POST** and passing the request JSON in the request payload.  
Consider that the HTTP request have a 200 status code even if the status of the response is false.

* **200:** everything is fine
* **400 (Bad Request):** invalid params or empty request is passed
* **401 (Unauthorized):** invalid or empty jwt is passed

URL oriented requests
---------------------

### **login**

* **Description:** login into the application

* **Request:**

    ```json
    {
        "request": "login",
        "user": "<USERNAME>",
        "password": "<PASSWORD>"
    }
    ```

* **Response:**

    ```json
    {
        "status": true,
        "data": {
            "jwt": "<JWT>"
        }
    }
    ```

    or

    ```json
    {
        "status": false,
        "data": {
            "error": "<ERROR DESCRIPTION>",
            "jwt": "<JWT>"
        }
    }
    ```

### **logout**

* **Description:** logout from the application

* **Request:**

    ```json
    {
        "request": "logout",
        "jwt": "<JWT>"
    }
    ```

* **Response:**

    ```json
    {
        "status": true
    }
    ```

    or

    ```json
    {
        "status": false,
        "data": {
            "error": "<ERROR DESCRIPTION>",
            "jwt": "<JWT>"
        }
    }
    ```

### **addReport**

* **Description:** add a new report to the database

* **Request:**

    ```json
    {
        "request": "addReport",
        "name": "<REPORT NAME>",
        "stime": "<STIME>",
        "period": "<PERIOD>",
        "width": "<WIDTH>",
        "height": "<HEIGHT>",
        "hostId": "<HOST ID>",
        "graphIds": ["<GRAPH ID>", "<GRAPH ID>"],
        "jwt": "<JWT>"
    }
    ```

* **Response:**

    ```json
    {
        "status": true,
        "jwt": "<JWT>"
    }
    ```

    or

    ```json
    {
        "status": false,
        "data": {
            "error": "<ERROR DESCRIPTION>",
            "jwt": "<JWT>"
        }
    }
    ```

### **getReport**

* **Description:** get all the reports from the database or just a single one if reportId is passed

* **Optional parameters:** reportId

* **Request:**

    ```json
    {
        "request": "getReport",
        "jwt": "<JWT>"
    }
    ```
    
    or

    ```json
    {
        "request": "getReport",
        "reportId": "<REPORT ID>",
        "jwt": "<JWT>"
    }
    ```

* **Response:**

    ```json
    {
        "status": true,
        "data": {
            "reports": [
                {
                    "id": "<REPORT ID>",
                    "name": "<REPORT NAME>",
                    "stime": "<STIME>",
                    "period": "<PERIOD>",
                    "width": "<WIDTH>",
                    "height": "<HEIGHT>",
                    "hostId": "<HOST ID>",
                    "graphIds": ["<GRAPH ID>", "<GRAPH ID>"],
                }
            ]
        },
        "jwt": "<JWT>"
    }
    ```

    or

    ```json
    {
        "status": false,
        "data": {
            "error": "<ERROR DESCRIPTION>",
            "jwt": "<JWT>"
        }
    }
    ```

### **deleteReport**

* **Description:** delete one or more reports from the database

* **Request:**

    ```json
    {
        "request": "deleteReport",
        "reports": ["<REPORT ID>", "<GREPORT ID>"],
        "jwt": "<JWT>"
    }
    ```

* **Response:**

    ```json
    {
        "status": true,
        "data": {
            "jwt": "<JWT>"
        }
    }
    ```
    
    or

    ```json
    {
        "status": false,
        "data": {
            "error": "<ERROR DESCRIPTION>",
            "jwt": "<JWT>"
        }
    }
    ```

### **downloadReportAsPng**

* **Description:** download one or more report in png format

* **Request:**

    ```json
    {
        "request": "downloadReportAsPng",
        "reports": ["<REPORT ID>", "<GREPORT ID>"],
        "jwt": "<JWT>"
    }
    ```

* **Response:**

    ```json
    {
        "status": true,
        "data": {
            "output": "<BASE 64 ENCODED FILE>",
            "mimetype": "<FILE MIMETYPE>",
            "name": "<FILE NAME>"
            "jwt": "<JWT>"
        }
    }
    ```
    
    or

    DA GESTIRE

### **downloadReportAsPdf**

* **Description:** download one or more report in pdf format

* **Request:**

    ```json
    {
        "request": "downloadReportAsPdf",
        "reports": ["<REPORT ID>", "<GREPORT ID>"],
        "jwt": "<JWT>"
    }
    ```

* **Response:**

    ```json
    {
        "status": true,
        "data": {
            "output": "<BASE 64 ENCODED FILE>",
            "mimetype": "<FILE MIMETYPE>",
            "name": "<FILE NAME>"
            "jwt": "<JWT>"
        }
    }
    ```
    
    or

    DA GESTIRE

AJAX oriented requests
----------------------

### **getVersion**

* **Description:** get the version of the application

* **Request:**

    ```json
    {
        "request": "getVersion"
    }
    ```

* **Response:**

    ```json
    {
        "status": true,
        "data": {
            "version": "0.1.0"
        }
    }
    ```

### **checkConfiguration**

* **Description:** check if all the required constants are defined and not empty in configuration.php and return a response

* **Request:**

    ```json
    {
        "request": "getVersion"
    }
    ```

* **Response:**

    ```json
        {
            "status": true
        },
    ```

    or

    ```json
    {
        "status": false,
        "data": {
            "invalidConfig": [
                "<CONFIGURATION>",
                "<CONFIGURATION>"
            ]
        }
    }
    ```

### **getHost**

* **Description:** get all the hosts available for the user or just a single one if hostid is passed

* **Optional parameters:** hostid

* **Request:**

    ```json
    {
        "request": "getHost",
        "jwt": "<JWT>"
    }
    ```

    or

    ```json
    {
        "request": "getHost",
        "hostid": "<HOST ID>",
        "jwt": "<JWT>"
    }
    ```

* **Response:**

    ```json
    {
        "status": true,
        "data": {
            "hosts": [
                {
                    "hostid": "<HOST ID>",
                    "host": "<HOST NAME>"
                },
                {
                    "hostid": "<HOST ID>",
                    "host": "<HOST NAME>"
                }
            ],
            "jwt": "<JWT>"
        }
    }
    ```

    or

    ```json
    {
        "status": false,
        "data": {
            "error": "<ERROR DESCRIPTION>",
            "jwt": "<JWT>"
        }
    }
    ```

### **getGraph**

* **Description:** get all the graphs from zabbix for a specific host id or just a single one if graphid is passed

* **Optional parameters:** graphid

* **Request:**

    ```json
    {
        "request": "getGraph",
        "hostid": "<HOST ID>",
        "jwt": "<JWT>"
    }
    ```

    or

    ```json
    {
        "request": "getGraph",
        "hostid": "<HOST ID>",
        "graphid": "<GRAPH ID>",
        "jwt": "<JWT>"
    }
    ```

* **Response:**

    ```json
    {
        "status": true,
        "data": {
            "graphs": [
                {
                    "graphid": "<GRAPH ID>",
                    "name": "<GRAPH NAME>"
                },
                {
                    "graphid": "<GRAPH ID>",
                    "name": "<GRAPH NAME>"
                }
            ],
            "jwt": "<JWT>"
        }
    }
    ```

    or

    ```json
    {
        "status": false,
        "data": {
            "error": "<ERROR DESCRIPTION>",
            "jwt": "<JWT>"
        }
    }
    ```