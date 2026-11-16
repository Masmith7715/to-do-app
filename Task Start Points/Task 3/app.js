/**
 * @file app.js
 * @description To-Do-List Application with LocalStorage support, task completion toggling, and deletion.
 */

// DOM Elements
const taskInput = document.querySelector('#taskInput');
const addTaskBtn = document.querySelector('#addTaskBtn');
const taskList = document.querySelector('#taskList');

// Tasks array to track state
let tasks = [];

/**
 * Load tasks from localStorage when the page loads
 */
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        tasks.forEach(task => renderTask(task));
    }
}

/**
 * Save the tasks array to localStorage
 */
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

/**
 * Render a single task item to the DOM
 * @param {Object} task - The task object { id, text, completed }
 */
function renderTask(task) {
    // Create a new <li> element
    const li = document.createElement('li');
    li.dataset.id = task.id;
    if (task.completed) {
        li.classList.add('completed');
    }

    // Task text span
    const span = document.createElement('span');
    span.textContent = task.text;
    
    // Toggle completed state when clicked
    span.addEventListener('click', () => {
        task.completed = !task.completed;
        li.classList.toggle('completed', task.completed);
        saveTasks();
    });

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    
    // Add a click listener that removes the task
    deleteBtn.addEventListener('click', () => {
        tasks = tasks.filter(t => t.id !== task.id);
        li.remove();
        saveTasks();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

/**
 * Add a new task
 */
function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);
    renderTask(newTask);
    saveTasks();

    // Clear the input field after adding a task
    taskInput.value = '';
    taskInput.focus();
}

// Add a click event listener to the Add button
addTaskBtn.addEventListener('click', addTask);

// Allow pressing 'Enter' key to add a task
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Initialize app on load
loadTasks();