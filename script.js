const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateProgress() {
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  progressBar.style.width = `${progress}%`;
  progressText.textContent = `${progress}% Completed`;
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    li.innerHTML = `
      <div class="task-info">
        <span>${task.text}</span>
        ${task.date ? `<div class="task-date">Due: ${task.date}</div>` : ""}
      </div>
      <div class="task-actions">
        <button class="complete-btn" data-index="${index}">${task.completed ? "Undo" : "Complete"}</button>
        <button class="edit-btn" data-index="${index}">Edit</button>
        <button class="delete-btn" data-index="${index}">Delete</button>
      </div>
    `;
    taskList.appendChild(li);
  });

  updateProgress();
  saveTasks();
}

function addTask() {
  const text = taskInput.value.trim();
  const date = taskDate.value;

  if (!text) return;

  tasks.push({ text, date: date || null, completed: false });
  taskInput.value = "";
  taskDate.value = "";
  renderTasks();
}

taskList.addEventListener("click", (e) => {
  const index = e.target.dataset.index;
  if (index === undefined) return;

  if (e.target.classList.contains("complete-btn")) {
    tasks[index].completed = !tasks[index].completed;
  } else if (e.target.classList.contains("edit-btn")) {
    const newText = prompt("Edit your task:", tasks[index].text);
    if (newText !== null && newText.trim() !== "") {
      tasks[index].text = newText.trim();
    }
  } else if (e.target.classList.contains("delete-btn")) {
    tasks.splice(index, 1);
  }

  renderTasks();
});

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

renderTasks();