<?php
if (!isset(array_keys($_GET)[0])) {
    $pos = $config['site']['start_page'];
} else {
    $pos = @array_keys($_GET)[0];
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $config['title'] ?></title>

    <script>
        var t0 = new Date();
        var api_call_count = 0;
        var local_address = "<?php echo $_ADDRESS ?>";
        var pos = "<?php echo $pos ?>";
        var github_shortname = "<?php echo $github['short_name'] ?>";
        var github_version = "<?php echo $github['version'] ?>";
        var logged_user = "<?php echo @$_SESSION['ID'] ?>";
        var user_session_id = "<?php echo @$_SESSION['ID'] ?>";
        var user_session_name = "<?php echo @$_SESSION['USERNICK'] ?>";
    </script>

    <script src="<?php echo $_ADDRESS ?>core/js/frameworks/jquery.min.js"></script>
    <script src="<?php echo $_ADDRESS ?>core/js/frameworks/bootstrap.bundle.min.js"></script>
    <script src="<?php echo $_ADDRESS ?>core/js/frameworks/adminlte.min.js"></script>
    <script src="<?php echo $_ADDRESS ?>core/js/frameworks/toastr.min.js"></script>
    <script src="<?php echo $_ADDRESS ?>core/js/frameworks/apexcharts.js"></script>
    <script src="<?php echo $_ADDRESS ?>core/js/frameworks/js.cookie.min.js"></script>
    <script src="<?php echo $_ADDRESS ?>core/js/frameworks/mousetrap.min.js"></script>
    <script src="<?php echo $_ADDRESS ?>core/js/frameworks/ag-grid-community.min.js"></script>
    <script src="<?php echo $_ADDRESS ?>core/js/frameworks/selectize.min.js"></script>

    <link href="<?php echo $_ADDRESS ?>core/style/frameworks/select2.min.css" rel="stylesheet" />
    <script type="text/javascript" src="<?php echo $_ADDRESS ?>core/js/frameworks/select2.min.js"></script>
    <script type="text/javascript" src="<?php echo $_ADDRESS ?>core/js/frameworks/moment.min.js"></script>

    <!--<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/overlayscrollbars/1.13.3/css/OverlayScrollbars.min.css" integrity="sha512-Xd88BFhCPQY5aAt2W3F5FmTVKkubVsAZDJBo7aXPRc5mwIPTEJvNeqbvBWfNKd4IEu3v9ots+nTdsTzVynlaOw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/overlayscrollbars/1.13.3/js/jquery.overlayScrollbars.min.js" integrity="sha512-PviP63d43OXLyLjCv3TawK1Rw4LQQsnH6yschHgK63LBvLpd1U1+7LM/OESlV/cSze5lFI3+f7JwKFEBEWNp1w==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
-->

    <link rel="stylesheet" href="<?php echo $_ADDRESS ?>core/style/frameworks/bootstrap.min.css">
    <link rel="stylesheet" href="<?php echo $_ADDRESS ?>core/style/frameworks/adminlte.min.css">
    <link rel="stylesheet" href="<?php echo $_ADDRESS ?>core/style/frameworks/fontawesome.all.css" />
    <link rel="stylesheet" href="<?php echo $_ADDRESS ?>core/style/frameworks/toastr.min.css" />
    <link rel="stylesheet" href="<?php echo $_ADDRESS ?>core/style/frameworks/ag-grid.css" />
    <link rel="stylesheet" href="<?php echo $_ADDRESS ?>core/style/frameworks/ag-theme-material.css" />
    <link rel="stylesheet" href="<?php echo $_ADDRESS ?>core/style/frameworks/selectize.default.css" />
    <link rel="stylesheet" href="<?php echo $_ADDRESS ?>core/style/frameworks/selectize.bootstrap5.css" />
    <link rel="stylesheet" href="<?php echo $_ADDRESS ?>core/style/main.css" />

    <script type="text/javascript" src="/core/script.php?js=main"></script>
</head>