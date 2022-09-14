<!-- Modals -->
<div id="lock_screen_modal" class="modal fade lockscreen" aria-hidden="true">
    <div class="lockscreen-wrapper">
        <div class="lockscreen-logo">
            <b><?php echo $config['title'] ?></b>
        </div>

        <div class="lockscreen-name"><?php echo $_SESSION['USERID'] ?></div>

        <div class="lockscreen-item">

            <div class="lockscreen-image">
                <img src="\elements\uploaded\users/nesty-160x160.png" alt="User Image">
            </div>


            <form id='login-form' class="lockscreen-credentials">
                <div class="input-group">
                    <input name="email_login" type="hidden" class="form-control" placeholder="email" value="<?php echo $_SESSION['USERID'] ?>">
                    <input name="password_login" autocomplete="password" type="password" class="form-control" placeholder="password">
                    <div class="input-group-append">
                        <button type="submit" class="btn">
                            <i class="fas fa-arrow-right text-muted"></i>
                        </button>
                    </div>
                </div>
            </form>

        </div>

        <div class="help-block text-center">
            Enter your password to retrieve your session
        </div>
        <div class="text-center">
            <a href="/api/?users&logout">Or sign in as a different user</a>
        </div>
        <div class="lockscreen-footer text-center">
            <?php echo _COPYRIGHT ?>
        </div>
    </div>
</div>
<script>
    $("#login-form").submit(function(e) {
        e.preventDefault();

        var form_login = $(this);

        var log_user = form_login[0].email_login.value;
        var log_pass = form_login[0].password_login.value;

        //console.log(`Login as "${log_user}" Pass: "${log_pass}"`);

        $.ajax({
            method: "POST",
            url: "../../api/?users&verify",
            // Passing all the variables
            data: {
                username: log_user,
                password: log_pass,
            },
        }).done(function(msg) {
            if (msg.includes("true")) {
                Cookies.set("lockscreen", "false");
                document.location = "./";
            } else {
                // console.log(msg);

                toastr.options = {
                    positionClass: "toast-top-center",
                };

                toastr["error"]("Password incorrect");
            }
        });
    });
</script>