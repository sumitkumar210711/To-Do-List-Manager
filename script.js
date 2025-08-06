let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function addTask() {
  const title = document.getElementById("task-title").value.trim();
  const priority = document.getElementById("task-priority").value;
  const deadline = document.getElementById("task-deadline").value;

  if (!title || !deadline) {
    alert("Please fill in all fields.");
    return;
  }

  const task = {
    id: Date.now(),
    title,
    priority,
    deadline,
    completed: false,
  };

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
  document.getElementById("task-title").value = "";
}

function renderTasks() {
  const list = document.getElementById("task-list");
  const statusFilter = document.getElementById("status-filter").value;
  const priorityFilter = document.getElementById("priority-filter").value;

  list.innerHTML = "";

  const today = new Date();

  tasks
    .filter(task => {
      return (
        (statusFilter === "All" || (statusFilter === "Completed") === task.completed) &&
        (priorityFilter === "All" || task.priority === priorityFilter)
      );
    })
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .forEach(task => {
      const card = document.createElement("div");
      card.className = `task-card ${task.completed ? "completed" : ""}`;

      const taskDeadline = new Date(task.deadline);
      const timeDiff = Math.floor((taskDeadline - today) / (1000 * 60 * 60 * 24));
      const overdue = timeDiff < 0;

      card.innerHTML = `
        <div class="task-info">
          <div class="task-title">${task.title}</div>
          <div class="task-meta">
            <span class="priority ${task.priority}">${task.priority}</span>
            <span>📅 ${task.deadline}</span>
            ${overdue && !task.completed ? `<span class="status-overdue">❌ Overdue</span>` : ""}
            ${!overdue && !task.completed ? `<span class="status-upcoming">⏳ Due in ${timeDiff} days</span>` : ""}
          </div>
        </div>
        <div class="task-actions">
          <input type="checkbox" ${task.completed ? "checked" : ""} onclick="toggleComplete(${task.id})" />
          <span onclick="deleteTask(${task.id})">🗑️</span>
        </div>
      `;

      list.appendChild(card);
    });
}

function toggleComplete(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function deleteTask(id) {
  if (confirm("Delete this task?")) {
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }
}

renderTasks();
