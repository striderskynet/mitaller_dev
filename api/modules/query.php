<?php
if ($_GET['query'] == "")
    $query = (string)$_POST['query'];
else
    $query = (string)$_GET['query'];

try {
    header('Content-Type: application/json');
    $response = $db->query($query)->fetchAll();
    echo json_encode($response, JSON_PRETTY_PRINT);

    //$db->fetchArray();
} catch (Exception $e) {
    return $e->getMessage();
}
