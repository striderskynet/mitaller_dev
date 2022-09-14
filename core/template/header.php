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

    <!--
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.1/dist/jquery.min.js"></script>
    <script src="https://adminlte.io/docs/3.2/assets/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/js/adminlte.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"></script>
    <script src="http://clients.technomobile.lan:85/assets/js/apexcharts.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js"></script>
    <script src="https://craig.global.ssl.fastly.net/js/mousetrap/mousetrap.min.js?a4098"></script>
    <script src="https://unpkg.com/ag-grid-community/dist/ag-grid-community.min.js"></script>
    -->
    <script>
        var t0 = new Date();
    </script>
    <script src="../../core/js/frameworks/jquery.min.js"></script>
    <script src="../../core/js/frameworks/bootstrap.bundle.min.js"></script>
    <script src="../../core/js/frameworks/adminlte.min.js"></script>
    <script src="../../core/js/frameworks/toastr.min.js"></script>
    <script src="../../core/js/frameworks/apexcharts.js"></script>
    <script src="../../core/js/frameworks/js.cookie.min.js"></script>
    <script src="../../core/js/frameworks/mousetrap.min.js"></script>
    <script src="../../core/js/frameworks/ag-grid-community.min.js"></script>
    <!--<script src="../../core/js/frameworks/selectize.min.js"></script>-->
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

    <link rel="stylesheet" href="../../core/style/frameworks/bootstrap.min.css">
    <link rel="stylesheet" href="../../core/style/frameworks/adminlte.min.css">
    <link rel="stylesheet" href="../../core/style/frameworks/fontawesome.all.css" />
    <link rel="stylesheet" href="../../core/style/frameworks/toastr.min.css" />
    <link rel="stylesheet" href="../../core/style/frameworks/ag-grid.css" />
    <link rel="stylesheet" href="../../core/style/frameworks/ag-theme-material.css" />
    <link rel="stylesheet" href="../../core/style/frameworks/selectize.default.css" />
    <link rel="stylesheet" href="../../core/style/frameworks/selectize.bootstrap5.css" />
    <link rel="stylesheet" href="../../core/style/main.css" />

    <script>
        let pos = "<?php echo $pos ?>";
        const github_shortname = "<?php echo $github['short_name'] ?>";
        const github_version = "<?php echo $github['version'] ?>";
        const logged_user = "<?php echo $_SESSION['ID'] ?>";
    </script>
</head>