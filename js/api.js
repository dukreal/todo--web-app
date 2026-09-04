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

/**
 * Get a user's tasks, filtered by status.
 * @param {string} status - "active" or "inactive"
 * @param {string|number} userId
 * @param {function} onSuccess - callback(data) where data is an array of tasks
 * @param {function} onError - callback(message)
 */
function apiGetItems(status, userId, onSuccess, onError) {
  $.ajax({
    url: API_URL + "/getItems_action.php",
    method: "GET",
    data: {
      status: status,
      user_id: userId
    },
    dataType: "json",
    success: function (response) {
      if (response.status === 200) {
        // API may return a single object or an array depending on result count.
        const items = Array.isArray(response.data) ? response.data : (response.data ? [response.data] : []);
        onSuccess(items);
      } else {
        onError(response.message || "Unable to load tasks.");
      }
    },
    error: function () {
      onError("Unable to reach the server. Please try again.");
    }
  });
}

/**
 * Add a new task.
 * @param {object} itemInfo - { item_name, item_description, user_id }
 * @param {function} onSuccess - callback(data)
 * @param {function} onError - callback(message)
 */
function apiAddItem(itemInfo, onSuccess, onError) {
  $.ajax({
    url: API_URL + "/addItem_action.php",
    method: "POST",
    contentType: "text/plain",
    data: JSON.stringify(itemInfo),
    dataType: "json",
    success: function (response) {
      if (response.status === 200) {
        onSuccess(response.data);
      } else {
        onError(response.message || "Unable to add task.");
      }
    },
    error: function () {
      onError("Unable to reach the server. Please try again.");
    }
  });
}

/**
 * Edit an existing task.
 * @param {object} itemInfo - { item_id, item_name, item_description }
 * @param {function} onSuccess - callback(data)
 * @param {function} onError - callback(message)
 */
function apiEditItem(itemInfo, onSuccess, onError) {
  $.ajax({
    url: API_URL + "/editItem_action.php",
    method: "PUT",
    contentType: "text/plain",
    data: JSON.stringify(itemInfo),
    dataType: "json",
    success: function (response) {
      if (response.status === 200) {
        onSuccess(response.data);
      } else {
        onError(response.message || "Unable to update task.");
      }
    },
    error: function () {
      onError("Unable to reach the server. Please try again.");
    }
  });
}