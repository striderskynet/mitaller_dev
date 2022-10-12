<?php
switch (array_keys($_GET)[1]) {
    case "insert":
        echo clients_insert();
        break;

    case "list":
        echo clients_list();
        break;

    case "search":
        echo clients_search();
        break;

    case "query":
        echo clients_query();
        break;
}

function clients_insert()
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

    $query = "INSERT INTO `data_clients` ( {$keys} ) VALUES ( {$values} );";

    // debug(4, $query);

    if ($db->query($query)) return "true";
    else return "false";
}

function clients_list()
{
    global $db;
    $query = 'SELECT * FROM `data_clients` ORDER BY id DESC';
    $data = $db->query($query)->fetchAll();

    header('Content-Type: application/json');
    return json_encode($data, JSON_PRETTY_PRINT);
}

function clients_search()
{
    global $db;
    $query = 'SELECT * FROM `data_clients` WHERE `name` like "%' . $_GET['query'] . '%"';
    //$query = 'SELECT * FROM `data_clients`';
    $data = $db->query($query)->fetchAll();

    header('Content-Type: application/json');
    $res = (object) ['repositories' => $data];
    return json_encode($res, JSON_PRETTY_PRINT);
}

function clients_query()
{
    global $db;
    $query =  $_POST['query'];

    if ($db->query($query)) return "true";
    else return "false";
}
