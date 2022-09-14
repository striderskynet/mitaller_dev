<?php
function theme($url, $var)
{
    $theme = file_get_contents(_THEME_DIR . "html" . DS . $url);

    foreach ($var as $v) {
        $replace_val = "{" . array_search($v, $var) . "}";
        $theme = str_replace($replace_val, $v, $theme);
    }

    return $theme;
}
