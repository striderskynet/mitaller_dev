<?php
switch (array_keys($_GET)[1]) {
    case "verify":
        echo users_verify();
        break;
    case "logout":
        echo users_logout();
        break;
    case "search":
        echo users_search();
        break;
    case "list":
        echo users_list();
        break;
}

function users_list()
{
    global $db;
    $query = 'SELECT * FROM `general_users`';
    $data = $db->query($query)->fetchAll();

    header('Content-Type: application/json');
    return json_encode($data);
}


function users_search()
{
    global $db;
    $query = 'SELECT * FROM `general_users` WHERE `username` like "%' . $_GET['query'] . '%" OR `name` like "%' . $_GET['query'] . '%"';
    //$query = 'SELECT * FROM `data_clients`';
    $data = $db->query($query)->fetchAll();

    header('Content-Type: application/json');
    $res = (object) ['repositories' => $data];
    return json_encode($res, JSON_PRETTY_PRINT);
}

function users_verify()
{
    global $db;

    $log_user = $_POST['username'];
    $log_pass = md5($_POST['password']);


    $query = "SELECT * FROM general_users WHERE `username`='{$log_user}' AND `password`='{$log_pass}'";

    //debug(5, $query);
    $result = $db->query($query)->fetchArray();

    if (count($result) > 0) {
        $_SESSION['USERID'] = $result['username'];
        $_SESSION['SSID'] = $result['username'] . date("dd/mm/yy/");
        //$_SESSION['USER_ROLE'] = $result['role'];
        //$_SESSION['AVATAR'] = $result['avatar'];
        $_SESSION['ID'] = $result['id'];

        return " {\"login\":\"true\"}\n";
    } else {
        return $log_pass . "{\"login\":\"false\"}\n";
    }

    //return json_encode($result);
}

function users_logout()
{

    setcookie('lockscreen', "false", time() + (86400 * 30), "/");
    session_destroy();
    reload("../");
}
