const todoForm = document.getElementById("todo-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const filterButtons = document.querySelectorAll(".filter-btn");

const STORAGE_KEY = "thiranex-task3-tasks";

let tasks = [];
let currentFilter = "all";

// Load tasks from localStorage
function loadTasks() {
    try {
        const savedTasks = localStorage.getItem(STORAGE_KEY);
        tasks = savedTasks ? JSON.parse(savedTasks) : [];
    } catch (error) {
        console.error("Error loading tasks:", error);
        tasks = [];
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Render tasks on the page
function renderTasks() {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item";
        li.dataset.id = task.id;

        const taskContent = document.createElement("div");
        taskContent.className = "task-content";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "complete-checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute(
            "aria-label",
            "Mark task as completed"
        );

        const taskText = document.createElement("span");
        taskText.className = "task-text";

        if (task.completed) {
            taskText.classList.add("completed");
        }

        taskText.textContent = task.text;

        taskContent.appendChild(checkbox);
        taskContent.appendChild(taskText);

        const taskActions = document.createElement("div");
        taskActions.className = "task-actions";

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "edit-btn";
        editButton.textContent = "Edit";

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        taskActions.appendChild(editButton);
        taskActions.appendChild(deleteButton);

        li.appendChild(taskContent);
        li.appendChild(taskActions);

        taskList.appendChild(li);
    });
}

// Add a new task
todoForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (text === "") {
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
});

// Edit and delete using event delegation
taskList.addEventListener("click", function(event) {
    const taskItem = event.target.closest(".task-item");

    if (!taskItem) {
        return;
    }

    const taskId = Number(taskItem.dataset.id);
    const task = tasks.find(task => task.id === taskId);

    if (!task) {
        return;
    }

    // Delete task
    if (event.target.classList.contains("delete-btn")) {
        tasks = tasks.filter(task => task.id !== taskId);

        saveTasks();
        renderTasks();
    }

    // Edit task
    if (event.target.classList.contains("edit-btn")) {
        const newText = prompt("Edit your task:", task.text);

        if (newText !== null && newText.trim() !== "") {
            task.text = newText.trim();

            saveTasks();
            renderTasks();
        }
    }
});

// Mark task as completed
taskList.addEventListener("change", function(event) {
    if (!event.target.classList.contains("complete-checkbox")) {
        return;
    }

    const taskItem = event.target.closest(".task-item");

    if (!taskItem) {
        return;
    }

    const taskId = Number(taskItem.dataset.id);
    const task = tasks.find(task => task.id === taskId);

    if (!task) {
        return;
    }

    task.completed = event.target.checked;

    saveTasks();
    renderTasks();
});

// Filter tasks
filterButtons.forEach(button => {
    button.addEventListener("click", function() {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        renderTasks();
    });
});

// Initialize application
loadTasks();
renderTasks();
