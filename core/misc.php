<?php
function reload($address = null)
{
    die("<header><script>window.location = '/" . $address . "';</script>");
}

function modal($modal_list)
{
    $list = explode(",", $modal_list);
    foreach ($list as $l) {
        require_once("./core/template/html/modals/{$l}.modal.html");
    }
}

function error()
{
}
