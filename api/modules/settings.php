<?php
switch (array_keys($_GET)[1]) {
    case "read":
        echo setting_read();
        break;
    case "write":
        echo setting_write();
        break;
}


function setting_read()
{
    global $db;
    $query = 'SELECT setting_value FROM `general_settings` WHERE `setting_name` = "' . $_GET["id"] . '"';
    $data = $db->query($query)->fetchArray();

    header('Content-Type: application/json');
    return json_encode($data, JSON_PRETTY_PRINT);
}

function setting_write()
{
    global $db;
    //$query = 'SELECT setting_value FROM `general_settings` WHERE `setting_name` = "' . $_GET["id"] . '"';
    $query = 'UPDATE `general_settings` SET `setting_value` = "' . $_GET["value"] . '"' . ' WHERE `setting_name` = "' . $_GET["id"] . '"';

    if ($db->query($query)) return "true";
    else return "false";
}
