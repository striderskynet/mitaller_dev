<?php
session_start();
@require_once('../config.php');


$api_directory = _LOCAL . "api/";


//debug(3, "Connecting to mysql database: " . str_replace("\n", "", var_export($database, true)));
$db = @new db($config['db']['host'], $config['db']['user'], $config['db']['pass'], $config['db']['data']);

//Login session
if (array_keys($_GET)[0] == "users"  && array_keys($_GET)[1] == "verify")
    require_once($api_directory . "modules/users.php");

/*
    if ( !isset($_SESSION['USER_ROLE']) )
        die("{Error:\":\"User not logged in, there is no client mode set}");*/

$action = array_keys($_GET)[0];


switch ($action) {
    case "users":
    case "clients":
    case "tickets":
    case "category":
    case "query":
    case "settings":
    case "sms":
    case "inventory":
    case "upload":
        require_once($api_directory . "modules/{$action}.php");
        break;
}

$db->close();
