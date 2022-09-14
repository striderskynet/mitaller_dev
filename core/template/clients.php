<?php
$position = array('Clients', 'Clients', 'clients');

$data = array("position" => $position[0], "title" => $config['title']);

$theme = theme($position[2] . ".theme.html", $data);
$theme_script = $position[2];
//$clients_data = api("clients", "list");
modal("client_new");
echo $theme;
