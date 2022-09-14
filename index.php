<?php
session_start();

require_once("./config.php");

//Building the website
require_once(_THEME_DIR . "header.php");

if (isset($_SESSION['USERID'])) {
    if (isset($_COOKIE['lockscreen']) && $_COOKIE['lockscreen'] == "true") {
        include_once(_THEME_DIR . "lockscreen.php");
        echo "<script type=\"text/javascript\" src=\"../../core/script.php?js=main\" defer></script>";
        exit;
    }

    require_once(_THEME_DIR . "navigation.php");


    switch (@array_keys($_GET)[0]) {
        default:
            include_once(_THEME_DIR . $config['site']['start_page'] . ".php");
            break;
        case "tickets":
        case "sales":
        case "finances":
        case "inventory":
        case "clients":
        case "analytics":
        case "calls":
            include_once(_THEME_DIR . @array_keys($_GET)[0] . ".php");
            break;
        case "update":
            include_once(_LOCAL . "core" . DS .  @array_keys($_GET)[0] . ".php");
            break;
    }

    require_once(_THEME_DIR . "footer.php");
} else {
    // Check if this is a new Install and Execute Install.php
    if ($_INSTALLED == true) {
        include_once(_THEME_DIR . "login.php");
    } else {
        if (file_exists(_THEME_DIR . "install.php"))
            include_once(_THEME_DIR . "install.php");
    }
}
