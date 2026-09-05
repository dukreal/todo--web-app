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
        // API returns data as either:
        // - an object keyed by index, e.g. {"0": {...}, "1": {...}}
        // - a single task object
        // - null/undefined when there are no tasks
        let items = [];
        if (Array.isArray(response.data)) {
          items = response.data;
        } else if (response.data && typeof response.data === "object") {
          items = Object.values(response.data);
        }
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
    method: "POST",
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

/**
 * Change a task's status (complete or restore).
 * @param {string|number} itemId
 * @param {string} status - "active" or "inactive"
 * @param {function} onSuccess - callback(data)
 * @param {function} onError - callback(message)
 */
function apiChangeStatus(itemId, status, onSuccess, onError) {
  $.ajax({
    url: API_URL + "/statusItem_action.php",
    method: "POST",
    contentType: "text/plain",
    data: JSON.stringify({
      item_id: itemId,
      status: status
    }),
    dataType: "json",
    success: function (response) {
      if (response.status === 200) {
        onSuccess(response.data);
      } else {
        onError(response.message || "Unable to update task status.");
      }
    },
    error: function () {
      onError("Unable to reach the server. Please try again.");
    }
  });
}

/**
 * Delete a task.
 * @param {string|number} itemId
 * @param {function} onSuccess - callback(data)
 * @param {function} onError - callback(message)
 */
function apiDeleteItem(itemId, onSuccess, onError) {
  $.ajax({
    url: API_URL + "/deleteItem_action.php?item_id=" + encodeURIComponent(itemId),
    method: "POST",
    dataType: "json",
    success: function (response) {
      if (response.status === 200) {
        onSuccess(response.data);
      } else {
        onError(response.message || "Unable to delete task.");
      }
    },
    error: function () {
      onError("Unable to reach the server. Please try again.");
    }
  });
}