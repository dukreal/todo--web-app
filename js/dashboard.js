// js/dashboard.js
// Handles: get tasks, display tasks, add/edit/complete/restore task, delete task (coming soon), logout.

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
  $("#user-info").text("Hi, " + fname + " " + lname);

  let activeCount = 0;
  let completedCount = 0;

  function updateTaskCounts() {
    $("#active-count").text(activeCount);
    $("#completed-count").text(completedCount);
    $("#tasks-summary").text(
      activeCount + " active \u00b7 " + completedCount + " completed"
    );
  }

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

  // ----- Add / Edit Task Modal -----
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

  // Edit button click is delegated since task cards are rendered dynamically.
  $(document).on("click", ".edit-btn", function () {
    const $card = $(this).closest(".task-card");
    const itemId = $card.attr("data-item-id");
    const itemName = $card.find(".task-name").text();
    const itemDescription = $card.find(".task-description").text();

    $("#modal-title").text("Edit Task");
    $("#task-item-id").val(itemId);
    $("#task-name").val(itemName);
    $("#task-description").val(itemDescription);
    $("#task-error").text("");
    $("#task-save-btn").text("Save");
    $("#task-modal").removeClass("hidden");
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
    } else {
      // Editing an existing task
      apiEditItem(
        {
          item_id: itemId,
          item_name: itemName,
          item_description: itemDescription
        },
        function () {
          $("#task-modal").addClass("hidden");
          loadActiveTasks();
          loadCompletedTasks();
        },
        function (message) {
          $("#task-error").text(message);
        }
      );
    }
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

    if (isCompleted) {
      completedCount = tasks ? tasks.length : 0;
    } else {
      activeCount = tasks ? tasks.length : 0;
    }
    updateTaskCounts();

    if (!tasks || tasks.length === 0) {
      const $empty = $("<div class='empty-state'></div>");
      $empty.append($("<div class='empty-state-icon'>&#128229;</div>"));
      $empty.append(
        $("<div></div>").text(
          isCompleted
            ? "Completed tasks will appear here."
            : "No active tasks. Add one to get started."
        )
      );
      $container.append($empty);
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

    // Delete handler will be wired up in an upcoming step.

    $actions.append($editBtn, $statusBtn, $deleteBtn);
    $card.append($name, $desc, $actions);

    return $card;
  }

  // ----- Complete a task -----
  $(document).on("click", ".complete-btn", function () {
    const $card = $(this).closest(".task-card");
    const itemId = $card.attr("data-item-id");

    apiChangeStatus(
      itemId,
      "inactive",
      function () {
        loadActiveTasks();
        loadCompletedTasks();
      },
      function (message) {
        alert(message);
      }
    );
  });

  // ----- Restore a task -----
  $(document).on("click", ".restore-btn", function () {
    const $card = $(this).closest(".task-card");
    const itemId = $card.attr("data-item-id");

    apiChangeStatus(
      itemId,
      "active",
      function () {
        loadActiveTasks();
        loadCompletedTasks();
      },
      function (message) {
        alert(message);
      }
    );
  });

});