let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    
    // Status metrics counters
    const totalCountEl = document.getElementById('totalTasksCount');
    const pendingCountEl = document.getElementById('pendingTasksCount');
    const completedCountEl = document.getElementById('completedTasksCount');
    const progressBar = document.getElementById('progressBar');
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');

    function saveToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateDashboardMetrics();
    }

    function updateDashboardMetrics() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;

        totalCountEl.textContent = total;
        pendingCountEl.textContent = pending;
        completedCountEl.textContent = completed;

        const progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100);
        progressBar.style.width = `${progressPercent}%`;
    }

    function renderTasks() {
        taskList.innerHTML = '';

        const priorityOrder = { high: 1, medium: 2, low: 3 };
        let renderedList = [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

        if (currentFilter === 'pending') {
            renderedList = renderedList.filter(t => !t.completed);
        } else if (currentFilter === 'completed') {
            renderedList = renderedList.filter(t => t.completed);
        }

        renderedList.forEach(task => {
            const li = document.createElement('li');
            li.className = `${task.priority}-priority`;
            if (task.completed) li.classList.add('completed');

            const contentDiv = document.createElement('div');
            contentDiv.className = 'task-content';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                saveToLocalStorage();
                renderTasks();
            });

            const span = document.createElement('span');
            span.className = 'task-text';
            span.textContent = task.text;

            contentDiv.appendChild(checkbox);
            contentDiv.appendChild(span);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '&times;';
            deleteBtn.title = 'Remove Milestone';
            deleteBtn.addEventListener('click', () => {
                tasks = tasks.filter(t => t.id !== task.id);
                saveToLocalStorage();
                renderTasks();
            });

            li.appendChild(contentDiv);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
    }

    addTaskBtn.addEventListener('click', () => {
        const text = taskInput.value.trim();
        if (!text) return;

        const newTask = {
            id: Date.now(),
            text,
            priority: prioritySelect.value,
            completed: false
        };

        tasks.push(newTask);
        saveToLocalStorage();
        renderTasks();
        taskInput.value = '';
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTaskBtn.click();
    });

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    clearCompletedBtn.addEventListener('click', () => {
        tasks = tasks.filter(t => !t.completed);
        saveToLocalStorage();
        renderTasks();
    });

    updateDashboardMetrics();
    renderTasks();
});