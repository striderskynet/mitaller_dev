<?php
$position = array('Calls', 'Calls', 'calls');

$data = array("position" => $position[0], "title" => $config['title']);

$theme = theme($position[2] . ".theme.html", $data);
$theme_script = $position[2];
//$clients_data = api("clients", "list");
echo $theme;
