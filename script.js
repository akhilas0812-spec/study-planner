// ======= Select elements =======
const taskForm = document.getElementById("taskForm");
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const priorityInput = document.getElementById("priority");
const dueDateInput = document.getElementById("dueDate");
const taskList = document.getElementById("taskList");
const filterCategory = document.getElementById("filterCategory");
const emptyState = document.getElementById("emptyState");

// ======= State =======
let tasks = [];

// Load from localStorage on first load
window.addEventListener("DOMContentLoaded", () => {
  const stored = localStorage.getItem("studyTasks");
  if (stored) {
    tasks = JSON.parse(stored);
  }
  renderTasks();
});

// ======= Helpers =======
function saveTasks() {
  localStorage.setItem("studyTasks", JSON.stringify(tasks));
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "task-item";

  const leftDiv = document.createElement("div");
  leftDiv.className = "task-left";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-checkbox";
  checkbox.checked = task.completed;

  const contentDiv = document.createElement("div");
  contentDiv.className = "task-content";

  const title = document.createElement("span");
  title.className = "task-title";
  if (task.completed) title.classList.add("completed");
  title.textContent = task.title;

  const metaDiv = document.createElement("div");
  metaDiv.className = "task-meta";

  const catBadge = document.createElement("span");
  catBadge.className = "badge badge-category";
  catBadge.textContent = task.category;

  const priorityBadge = document.createElement("span");
  priorityBadge.className =
    "badge " +
    (task.priority === "High"
      ? "badge-priority-high"
      : task.priority === "Medium"
      ? "badge-priority-medium"
      : "badge-priority-low");
  priorityBadge.textContent = `Priority: ${task.priority}`;

  metaDiv.appendChild(catBadge);
  metaDiv.appendChild(priorityBadge);

  if (task.dueDate) {
    const dateBadge = document.createElement("span");
    dateBadge.className = "badge badge-date";
    dateBadge.textContent = `Due: ${task.dueDate}`;
    metaDiv.appendChild(dateBadge);
  }

  contentDiv.appendChild(title);
  contentDiv.appendChild(metaDiv);

  leftDiv.appendChild(checkbox);
  leftDiv.appendChild(contentDiv);

  const actionsDiv = document.createElement("div");
  actionsDiv.className = "task-actions";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn-small btn-delete";
  deleteBtn.textContent = "Delete";

  actionsDiv.appendChild(deleteBtn);

  li.appendChild(leftDiv);
  li.appendChild(actionsDiv);

  // Events
  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    saveTasks();
    renderTasks();
  });

  deleteBtn.addEventListener("click", () => {
    tasks = tasks.filter((t) => t.id !== task.id);
    saveTasks();
    renderTasks();
  });

  return li;
}

// ======= Render =======
function renderTasks() {
  taskList.innerHTML = "";

  const filterValue = filterCategory.value;

  // Filter
  let visibleTasks =
    filterValue === "All"
      ? tasks
      : tasks.filter((t) => t.category === filterValue);

  // 🔥 SORT BY PRIORITY (High → Medium → Low)
  visibleTasks = visibleTasks.sort((a, b) => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // Empty state
  if (visibleTasks.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }

  // Render tasks
  visibleTasks.forEach((task) => {
    taskList.appendChild(createTaskElement(task));
  });
}

// ======= Form Submit =======
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  if (!title) return;

  const newTask = {
    id: Date.now(),
    title,
    category: categoryInput.value,
    priority: priorityInput.value,
    dueDate: dueDateInput.value,
    completed: false,
  };

  tasks.unshift(newTask);
  saveTasks();
  renderTasks();

  taskForm.reset();
  priorityInput.value = "Medium";
});

// ======= Filter Change =======
filterCategory.addEventListener("change", renderTasks);
