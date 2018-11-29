Discontinued
============

As of November 29, 2018, this project is no longer maintained. If you're interested in developing or maintaining feel free to fork it.  
Not working in Zabbix 4 due to changes in chart2.php (refer to issue [#2](../../issues/2)).  
Still working with Zabbix 3 but I pesonally don't recommend a production usage.

Welcome to Mabbix
======

A small web application written in PHP and AngularJS that interact with Zabbix in order to export graphs as PNG or PDF. It's fully developed on Zabbix **chart2.php**.

* A web application by **doubleD**
* Developed with **[Davide Zoccarato](https://github.com/dzoccarato)**

Screenshots
-----------

Screenshots taken from **Mabbix 0.1.0 (beta1)**

* **[Dashboard](https://raw.githubusercontent.com/davidegiacometti/mabbix/master/screenshots/dashboard.png)**
* **[New Report](https://raw.githubusercontent.com/davidegiacometti/mabbix/master/screenshots/new-report.png)**
* **[List Report](https://raw.githubusercontent.com/davidegiacometti/mabbix/master/screenshots/list-report.png)**

Requirements
------------

The web application has been developed and tested on **Debian 8.7 x64**, **Zabbix 3.0.7**, **MySQL 5.5** and **PHP 5.6**.
It should also work with other versions of Zabbix.

Since it's based on **[PHP PDO](http://php.net/manual/en/book.pdo.php)** you should be able to use a database different than MySQL.  
The schema for MySQL is provided.

Installation
------------

```bash
apt-get install php5-curl
wget https://github.com/davidegiacometti/mabbix/releases/download/beta1/mabbix-0.1.0.tar.gz
tar zxpf mabbix-0.1.0.tar.gz
mv mabbix /opt
mysql -u[USER] -h[HOST] -p -e "CREATE DATABASE mabbix CHARACTER SET utf8"
mysql -u[USER] -h[HOST] -p -e "CREATE USER 'mabbix'@'localhost' IDENTIFIED BY '[PASSWORD]'"
mysql -u[USER] -h[HOST] -p -e "GRANT SELECT, INSERT, UPDATE, DELETE ON mabbix.* TO 'mabbix'@'localhost'"
mysql -u[USER] -h[HOST] -p mabbix < /opt/mabbix/database/schema.sql
cp /opt/mabbix/public/back-end/core/configuration.php.example /opt/mabbix/public/back-end/core/configuration.php
# Edit the configuration.php with the settings of your environment
cp /opt/mabbix/public/config.sample.json /opt/mabbix/public/config.json
# Edit the config.json with the settings of your environment
ln -s /opt/mabbix/public /var/www/html/mabbix
# Have fun! :-)
```

Advanced users
--------------

_Developing with gulp, split Back-end and Front-end... Coming soon!_

Known issues
------------

* Download of reports in Internet Explorer and Edge isn't supported since for security reasons Microsoft doesn't allow href with base64 encoded contents.
* If you specify width and/or height of a graphs this isn't sized properly but unfortunately this is a Zabbix behavior.

Upcoming features
-----------------

* Reports edit
* Check if graphs and hosts still exists in Zabbix
* Send scheduled mail reports

Credits
-------

Back-end:
* **[Zabbix Wiki](https://www.zabbix.org/wiki/Get_Graph_Image_PHP)**
* **[Composer](https://github.com/composer/composer)**
* **[PHP-JWT](https://github.com/firebase/php-jwt)**
* **[mPDF](https://github.com/mpdf/mpdf)**

Front-end:
* **[npm](https://www.npmjs.com)**
* **[Bower](https://bower.io)**
* **[Gulp](http://gulpjs.com)**
* **[AngularJS Material](https://material.angularjs.org)**
* **[Material Icons](https://material.io/icons)**

Releases
--------

* **2017/07/12 0.1.0 (beta1)**

License
-------

Released under the GNU General Public License v3.0
