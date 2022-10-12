<?php
switch (array_keys($_GET)[1]) {
    case "list":
        echo inventory_list();
        break;
    case "items_insert":
        echo items_insert();
        break;
    case "query":
        echo inventory_query();
        break;
    case "supplier_list":
        echo supplier_list();
        break;
    case "manufacturer_list":
        echo manufacturer_list();
        break;
}

function inventory_list()
{
    global $db;

    $query = 'SELECT * FROM `inventory_items`';

    $data = $db->query($query)->fetchAll();

    header('Content-Type: application/json');
    return json_encode($data,  JSON_PRETTY_PRINT);
}

function items_insert()
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

    $query = "INSERT INTO `inventory_items` ( {$keys} ) VALUES ( {$values} );";

    echo $query;
    // debug(4, $query);

    if ($db->query($query)) return "true";
    else return "false";
}

function inventory_query()
{
    global $db;
    $query =  $_POST['query'];

    if ($db->query($query)) return "true";
    else return "false";
}

function supplier_list()
{
    global $db;

    if (@array_keys($_GET)[2] == "where")
        $where = $_GET[array_keys($_GET)[2]];
    else $where = "";


    $query = 'SELECT * FROM `inventory_supplier` ' . $where;


    //$query = 'SELECT * FROM `inventory_supplier`';
    $data = $db->query($query)->fetchAll();

    header('Content-Type: application/json');
    return json_encode($data,  JSON_PRETTY_PRINT);
}


function manufacturer_list()
{
    global $db;

    if (@array_keys($_GET)[2] == "where")
        $where = $_GET[array_keys($_GET)[2]];
    else $where = "";


    $query = 'SELECT * FROM `inventory_brands` ' . $where;


    //$query = 'SELECT * FROM `inventory_supplier`';
    $data = $db->query($query)->fetchAll();

    header('Content-Type: application/json');
    return json_encode($data,  JSON_PRETTY_PRINT);
}
