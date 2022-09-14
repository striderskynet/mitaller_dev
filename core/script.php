<?php
header('Content-Type: text/javascript');
require_once("../config.php");
$theme_path = "./template/script/";

if (isset($_GET['js'])) {
    $script = null;

    switch ($_GET['js']) {
        case "main":
            $script .= file_get_contents("../core/js/main.js");
            break;
        default:
            $file = $theme_path . $_GET['js'] . ".exec.js";
            if (file_exists($file))
                $script = file_get_contents($file);
            break;
    }

    if (!_DEBUG) {
        require_once("./minifier.php");
        $script = \JShrink\Minifier::minify($script);
    }

    echo $script;
}
