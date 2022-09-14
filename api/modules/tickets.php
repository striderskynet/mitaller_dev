<?php
switch (array_keys($_GET)[1]) {

    case "list":
        echo tickets_list();
        break;

    case "query":
        echo tickets_query();
        break;

    case "status_list":
        echo status_list();
        break;

    case "status_add":
        echo status_add();
        break;

    case "insert":
        echo tickets_insert();
        break;
}

function tickets_list()
{
    global $db;
    $WHERE = null;

    if ($_GET['paid'] == "false") {
        $WHERE = "WHERE `tickets_status` != 7";
    }
    $query = 'SELECT * FROM `data_tickets` ' . $WHERE . ' ORDER BY `id` DESC';
    $data = $db->query($query)->fetchAll();

    return json_encode($data);
}

function status_list()
{
    global $db;
    $query = 'SELECT * FROM `data_tickets_status`';
    $data = $db->query($query)->fetchAll();

    return json_encode($data);
}

function tickets_query()
{
    global $db;
    $query =  $_POST['query'];

    if ($db->query($query)) return "true";
    else return "false";
}

function tickets_insert()
{
    global $db;

    $keys = null;
    $values = null;


    foreach (array_keys($_POST) as $k) {
        $keys[] = "`{$k}`";
        $values[] = "'{$_POST[$k]}'";
    }


    $keys = implode(', ', $keys);
    $values =  implode(', ', $values);

    $query = "INSERT INTO `data_tickets` ( {$keys} ) VALUES ( {$values} );";

    //echo $query;
    // debug(4, $query);

    if ($db->query($query)) return "true";
    else return "false";
}

function status_add()
{
    global $db;

    $keys = null;
    $values = null;
    $result = false;

    foreach (array_keys($_POST) as $k) {
        $keys[] = "`{$k}`";
        $values[] = "'{$_POST[$k]}'";
    }

    $keys = implode(', ', $keys);
    $values =  implode(', ', $values);

    $query = "INSERT INTO `data_tickets_update` ( {$keys} ) VALUES ( {$values} );";
    $query_ticket = "UPDATE `data_tickets` SET `tickets_status`='{$_POST['update_status']}', `tickets_charge`='{$_POST['update_charge']}' WHERE `id`='{$_POST['ticket_id']}';";
    //echo $query;

    if ($db->query($query)) $result = "true";
    if ($db->query($query_ticket)) $result = "true";

    return $result;
}
