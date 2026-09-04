// js/dashboard.js
// Handles: get tasks, display tasks, add/edit/complete/restore/delete task (coming soon), logout.

$(document).ready(function () {

  const userId = localStorage.getItem("user_id");

  // If no user is logged in, kick back to sign in.
  if (!userId) {
    window.location.href = "signin.html";
    return;
  }

  // ----- Show user info -----
  const fname = localStorage.getItem("user_fname");
  const lname = localStorage.getItem("user_lname");
  $("#user-info").text("Welcome, " + fname + " " + lname);

  // ----- Logout -----
  $("#logout-btn").on("click", function () {
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_fname");
    localStorage.removeItem("user_lname");
    localStorage.removeItem("user_email");
    window.location.href = "signin.html";
  });

  // ----- Load tasks on page load -----
  loadActiveTasks();
  loadCompletedTasks();

  // ----- Add Task Modal -----
  $("#add-task-btn").on("click", function () {
    $("#modal-title").text("Add Task");
    $("#task-item-id").val("");
    $("#task-name").val("");
    $("#task-description").val("");
    $("#task-error").text("");
    $("#task-save-btn").text("Add");
    $("#task-modal").removeClass("hidden");
  });

  $("#task-cancel-btn").on("click", function () {
    $("#task-modal").addClass("hidden");
  });

  $("#task-form").on("submit", function (e) {
    e.preventDefault();

    const itemId = $("#task-item-id").val();
    const itemName = $("#task-name").val().trim();
    const itemDescription = $("#task-description").val().trim();

    $("#task-error").text("");

    if (!itemId) {
      // Adding a new task
      apiAddItem(
        {
          item_name: itemName,
          item_description: itemDescription,
          user_id: userId
        },
        function () {
          $("#task-modal").addClass("hidden");
          loadActiveTasks();
        },
        function (message) {
          $("#task-error").text(message);
        }
      );
    }
    // Editing an existing task will be handled here in the next step (Task 11).
  });

  function loadActiveTasks() {
    apiGetItems(
      "active",
      userId,
      function (tasks) {
        renderTaskList(tasks, "#active-tasks-list", false);
      },
      function (message) {
        console.error("Failed to load active tasks:", message);
      }
    );
  }

  function loadCompletedTasks() {
    apiGetItems(
      "inactive",
      userId,
      function (tasks) {
        renderTaskList(tasks, "#completed-tasks-list", true);
      },
      function (message) {
        console.error("Failed to load completed tasks:", message);
      }
    );
  }

  /**
   * Render a list of tasks into the given container.
   * @param {Array} tasks
   * @param {string} containerSelector
   * @param {boolean} isCompleted - true for the Completed Tasks list
   */
  function renderTaskList(tasks, containerSelector, isCompleted) {
    const $container = $(containerSelector);
    $container.empty();

    if (!tasks || tasks.length === 0) {
      $container.append($("<p class='empty-message'></p>").text(
        isCompleted ? "No completed tasks." : "No active tasks."
      ));
      return;
    }

    tasks.forEach(function (task) {
      $container.append(buildTaskCard(task, isCompleted));
    });
  }

  /**
   * Build the DOM element for a single task card.
   * @param {object} task - { item_id, item_name, item_description, status, user_id, timemodified }
   * @param {boolean} isCompleted
   */
  function buildTaskCard(task, isCompleted) {
    const $card = $("<div class='task-card'></div>").attr("data-item-id", task.item_id);

    const $name = $("<h3 class='task-name'></h3>").text(task.item_name);
    const $desc = $("<p class='task-description'></p>").text(task.item_description);

    if (isCompleted) {
      $card.addClass("completed");
    }

    const $actions = $("<div class='task-actions'></div>");

    const $editBtn = $("<button class='edit-btn'>Edit</button>");
    const $statusBtn = isCompleted
      ? $("<button class='restore-btn'>Restore</button>")
      : $("<button class='complete-btn'>Complete</button>");
    const $deleteBtn = $("<button class='delete-btn'>Delete</button>");

    // Edit / Complete-Restore / Delete handlers will be wired up in upcoming steps
    // (Edit Task, Complete/Restore, Delete).

    $actions.append($editBtn, $statusBtn, $deleteBtn);
    $card.append($name, $desc, $actions);

    return $card;
  }

});