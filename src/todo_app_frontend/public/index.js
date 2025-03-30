import { todo_app_backend } from "../../declarations/todo_app_backend/index.js";

async function loadTasks() {
    const tasks = await todo_app_backend.getTasks();
    console.log("Loaded tasks:", tasks);
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    tasks.forEach(task => {
      const li = document.createElement("li");
      li.className = task.completed ? "completed" : "";
      li.innerHTML = `
        <input type="checkbox" ${task.completed ? "checked" : ""} data-id="${task.id}">
        ${task.text}
        <button data-id="${task.id}">Delete</button>
      `;
      taskList.appendChild(li);
    });



  // Привязка событий для чекбоксов и кнопок удаления
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', async (e) => {
      const id = Number(e.target.getAttribute('data-id'));
      await todo_app_backend.toggleTask(BigInt(id));
      await loadTasks();
    });
  });

  document.querySelectorAll('button[data-id]').forEach(button => {
    button.addEventListener('click', async (e) => {
      const id = Number(e.target.getAttribute('data-id'));
      await todo_app_backend.deleteTask(BigInt(id));
      await loadTasks();
    });
  });
}

async function addTask() {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();
    if (text) {
      console.log("Adding task:", text);
      try {
        await todo_app_backend.addTask(text);
        console.log("Task added successfully");
      } catch (error) {
        console.error("Error adding task:", error);
      }
      input.value = "";
      await loadTasks();
    }
  }

// Привязка события для кнопки добавления
document.getElementById("addTaskButton").addEventListener("click", addTask);

// Загрузка задач при старте
window.onload = loadTasks;