<footer class="main-footer">
    <?php echo _COPYRIGHT ?>
    <div class="float-right d-none d-sm-inline-block">
        API Executions: <b id='api_call_count'>0</b> in <b id='api_time_count'>0</b> seconds.
        <div class='vr'></div>
        <b>Version</b> <?php echo _FULLVERSION ?>
    </div>
</footer>
</div>
<?php require_once("./core/template/lockscreen.php") ?>

</body>

<?php
echo ("<script type=\"text/javascript\" src=\"http://" . $_SERVER['HTTP_HOST'] . "/core/script.php?js=main\" defer></script>\n");
if (isset($theme_script)) echo ("<script type=\"text/javascript\" src=\"http://" . $_SERVER['HTTP_HOST'] . "/core/script.php?js=$theme_script\" defer></script>");
?>

<script>
    $(function() {
        $('[data-type="tooltip"]').tooltip();
    });


    var t1 = new Date() - t0;
    $("b#api_time_count").html(t1 / 1000);
</script>

</html>