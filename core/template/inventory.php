<?php

if (!isset($_GET[0])) {
    error(404);
}



$data['asd'] = "";
switch (array_keys($_GET)[1]) {
    case "list":
        $position = array('Inventory list', 'Inventory list', 'inv_list');
        $theme = theme("inventory\list.theme.html", $data);
        break;
    case "categories":
        $position = array('Categories', 'Categories', 'inv_categories');
        modal("inventory_category");
        $theme = theme("inventory\categories.theme.html", $data);
        break;
}

$theme_script = $position[2];
echo $theme;
