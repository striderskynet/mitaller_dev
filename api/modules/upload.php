<?php
switch (array_keys($_GET)[1]) {
    case "item_picture":
        echo item_picture();
        break;
}

function item_picture()
{
    global $db;

    $query = 'SELECT * FROM `inventory_items` ORDER BY `id` DESC LIMIT 1';

    $data = $db->query($query)->fetchArray();

    $itemName = $_FILES['file']['name'];
    $ext = pathinfo($itemName, PATHINFO_EXTENSION);


    $uploaddir = '../elements/uploaded/items/';
    $uploadfile = $uploaddir . basename($data['id'] . ".itemid." . $ext);


    if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
        echo "true";
    } else {
        echo "false";
    }
}
