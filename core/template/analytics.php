<?php
$position = array('Analytics', 'Analytics', 'analytics');

$data = array(
    "tasks_amount" => 120,
    "tasks_completion" => 80,
    "clients_amount" => 20,
    "sales_amount" => 50,
    "position" => $position[0],
    "title" => $config['title']
);

$theme = theme($position[2] . ".theme.html", $data);
$theme_script = $position[2];
//$clients_data = api("clients", "list");
?>

<?php echo $theme; ?>