// js/auth.js
// Handles Sign Up, Sign In, Logout, and localStorage user data.

$(document).ready(function () {

  // ----- Sign In -----
  $("#signin-form").on("submit", function (e) {
    e.preventDefault();

    const email = $("#email").val().trim();
    const password = $("#password").val();

    $("#signin-error").text("");

    apiSignIn(
      email,
      password,
      function (data) {
        localStorage.setItem("user_id", data.id);
        localStorage.setItem("user_fname", data.fname);
        localStorage.setItem("user_lname", data.lname);
        localStorage.setItem("user_email", data.email);
        window.location.href = "dashboard.html";
      },
      function (message) {
        $("#signin-error").text(message);
      }
    );
  });

  // ----- Sign Up -----
  $("#signup-form").on("submit", function (e) {
    e.preventDefault();

    const first_name = $("#first_name").val().trim();
    const last_name = $("#last_name").val().trim();
    const email = $("#email").val().trim();
    const password = $("#password").val();
    const confirm_password = $("#confirm_password").val();

    $("#signup-error").text("");

    if (password !== confirm_password) {
      $("#signup-error").text("Passwords do not match.");
      return;
    }

    apiSignUp(
      {
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password,
        confirm_password: confirm_password
      },
      function () {
        window.location.href = "signin.html";
      },
      function (message) {
        $("#signup-error").text(message);
      }
    );
  });

});