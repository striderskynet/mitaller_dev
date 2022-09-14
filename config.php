<?php
error_reporting(E_ALL);


define("DS", DIRECTORY_SEPARATOR);
define("_LOCAL", $_SERVER['DOCUMENT_ROOT'] . DS);
define("_THEME_DIR", _LOCAL . "core" . DS . "template" . DS);

define("_VERSION", "0.1.0");
define("_FULLVERSION", "0.1.0-dev");
define("_COMMIT", "2022-06-29T20:28:52Z");
define("_DEBUG", true);


$config['title'] = "miTaller";
$_ADDRESS = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]" . "/";
$_INSTALLED = true;


$config['db']['host'] = "127.0.0.1";
$config['db']['user'] = "root";
$config['db']['pass'] = "";
$config['db']['data'] = "mitaller_dev";


$config['misc']['pagination'] = 10;

$config['site']['start_page'] = "clients";

define("_COPYRIGHT", "Copyright &copy; 2022-2023 <a href=\"https://miTaller.io\" class=\"text-black\"> | <b>miTaller.io</b></a>");

// GitHub Update Info
$github['owner'] = "striderskynet";
$github['proyect_name'] = "miTaller";
$github['short_name'] = "miTaller";
$github['version'] = _VERSION;
//$github['address'] = "https://api.github.com/repos/{$github['owner']}/{$github['proyect_name']}/releases";



// DONT TOUCH BELOW THIS LINE
require_once(_LOCAL . "core" . DS . "core.php");
require_once(_LOCAL . "core" . DS . "misc.php");
//require_once(_LOCAL . "core" . DS . "debug.php");
require_once(_LOCAL . "core" . DS . "class" . DS . "mysql.php");
