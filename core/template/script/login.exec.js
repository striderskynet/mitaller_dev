$("#login-form").submit(function (e) {
  e.preventDefault();

  var form_login = $(this);

  var log_user = form_login[0].email_login.value;
  var log_pass = form_login[0].password_login.value;

  //console.log(`Login as "${log_user}" Pass: "${log_pass}"`);

  $.ajax({
    method: "POST",
    url: local_address + "/api/?users&verify",
    // Passing all the variables
    data: {
      username: log_user,
      password: log_pass,
    },
  }).done(function (msg) {
    if (msg.includes("true")) {
      document.location = "./";
    } else {
      // console.log(msg);

      toastr.options = {
        positionClass: "toast-top-center",
      };

      toastr["error"]("Username or Password incorrect");
    }
  });
});
