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
        // Save logged-in user info to localStorage
        localStorage.setItem("user_id", data.id);
        localStorage.setItem("user_fname", data.fname);
        localStorage.setItem("user_lname", data.lname);
        localStorage.setItem("user_email", data.email);

        // Redirect to dashboard
        window.location.href = "dashboard.html";
      },
      function (message) {
        $("#signin-error").text(message);
      }
    );
  });

});