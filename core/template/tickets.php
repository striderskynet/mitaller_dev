<?php
$position = array('Tickets', 'Tickets', 'tickets');


modal("tickets_new,client_new,tickets_status,tickets_history");

$data = array("position" => $position[0], "title" => $config['title']);
$theme = theme($position[2] . ".theme.html", $data);
$theme_script = $position[2];
echo $theme;
