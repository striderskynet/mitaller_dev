<?php
switch (array_keys($_GET)[1]) {
    case "search":
        echo category_search();
        break;

    case "query":
        echo category_query();
        break;

    case "list":
        echo category_list();
        break;

    case "inv_list":
        echo inventory_list();
        break;
}

function category_search()
{
    global $db;
    $query = 'SELECT * FROM `data_tickets_category` WHERE `name` like "%' . $_GET['query'] . '%"';
    $data = $db->query($query)->fetchAll();

    header('Content-Type: application/json');
    $res = (object) ['repositories' => $data];
    return json_encode($res, JSON_PRETTY_PRINT);
}

function category_list()
{
    global $db;
    $query = 'SELECT * FROM `data_tickets_category`';
    $data = $db->query($query)->fetchAll();

    header('Content-Type: application/json');
    return json_encode($data,  JSON_PRETTY_PRINT);
}

function category_query()
{
    global $db;
    $query =  $_POST['query'];

    if ($db->query($query)) return "true";
    else return "false";
}

function inventory_list()
{
    global $db;
    $query = 'SELECT * FROM `inventory_category` ORDER BY `subcategoryID`';
    $data = $db->query($query)->fetchAll();

    header('Content-Type: application/json');
    return json_encode($data,  JSON_PRETTY_PRINT);
}
