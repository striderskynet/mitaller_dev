<?php
$position = array('Loguearse', 'Loguearse', 'login');

$data = array("title" => $config['title']);

$theme = theme($position[2] . ".theme.html", $data);
$theme_script = $position[2];
//$clients_data = api("clients", "list");
?>

<?php echo $theme; ?>

<?php
if ($theme_script) echo ("<script type=\"text/javascript\" src=\"{$_ADDRESS}/core/script.php?js=$theme_script\" defer></script>");
?>