// js/api.js
// Handles all communication with the To-Do List API.

const API_URL = "https://todo-list.dcism.org";

/**
 * Sign in a user.
 * @param {string} email
 * @param {string} password
 * @param {function} onSuccess - callback(data)
 * @param {function} onError - callback(message)
 */
function apiSignIn(email, password, onSuccess, onError) {
  $.ajax({
    url: API_URL + "/signin_action.php",
    method: "GET",
    data: {
      email: email,
      password: password
    },
    dataType: "json",
    success: function (response) {
      if (response.status === 200) {
        onSuccess(response.data);
      } else {
        onError(response.message || "Sign in failed.");
      }
    },
    error: function () {
      onError("Unable to reach the server. Please try again.");
    }
  });
}

/**
 * Sign up a new user.
 * @param {object} userInfo - { first_name, last_name, email, password, confirm_password }
 * @param {function} onSuccess - callback(data)
 * @param {function} onError - callback(message)
 */
function apiSignUp(userInfo, onSuccess, onError) {
  $.ajax({
    url: API_URL + "/signup_action.php",
    method: "POST",
    contentType: "text/plain",
    data: JSON.stringify(userInfo),
    dataType: "json",
    success: function (response) {
      if (response.status === 200) {
        onSuccess(response.data);
      } else {
        onError(response.message || "Sign up failed.");
      }
    },
    error: function () {
      onError("Unable to reach the server. Please try again.");
    }
  });
}