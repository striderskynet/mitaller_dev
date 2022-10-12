<?php

if (!isset($_GET[0])) {
    error(404);
}

$data['asd'] = "";
switch (@array_keys($_GET)[1]) {
    default:
    case "list":
        $position = array('Inventory list', 'Inventory list', 'inv_list');
        modal("inventory_item");
        $theme = theme("inventory\list.theme.html", $data);
        break;
    case "supplier":
        $position = array('Supplier list', 'supplier list', 'inv_supplier');
        $theme = theme("inventory\supplier.theme.html", $data);
        break;
    case "manufacturers":
        $position = array('Manufacturers list', 'manufacturers list', 'inv_manufacturers');
        $theme = theme("inventory\manufacturers.theme.html", $data);
        break;
    case "categories":
        $position = array('Categories', 'Categories', 'inv_categories');
        modal("inventory_category");
        $theme = theme("inventory\categories.theme.html", $data);
        break;
}

$theme_script = $position[2];
echo $theme;
