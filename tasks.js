// ========================================
// Tasks.js - Task Management
// ========================================

/**
 * Get all tasks
 * @returns {Array} Array of tasks
 */
function getTasks() {
    return loadTasks();
}

/**
 * Get task by ID
 * @param {string} taskId - Task ID
 * @returns {Object|null} Task object or null
 */
function getTaskById(taskId) {
    const tasks = loadTasks();
    return tasks.find(t => t.taskId === taskId) || null;
}

/**
 * Add a new task
 * @param {Object} taskData - Task data object
 * @returns {Object} Created task
 */
function addTask(taskData) {
    const tasks = loadTasks();

    const newTask = {
        taskId: generateId(),
        taskName: taskData.taskName.trim(),
        subjectId: taskData.subjectId,
        deadline: taskData.deadline,
        priority: taskData.priority,
        status: taskData.status || 'Pending',
        createdDate: new Date().toISOString()
    };

    tasks.push(newTask);
    saveTasks(tasks);

    return newTask;
}

/**
 * Update a task
 * @param {string} taskId - Task ID
 * @param {Object} taskData - Updated task data
 * @returns {Object|null} Updated task or null
 */
function updateTask(taskId, taskData) {
    const tasks = loadTasks();
    const index = tasks.findIndex(t => t.taskId === taskId);

    if (index === -1) return null;

    tasks[index] = {
        ...tasks[index],
        taskName: taskData.taskName ? taskData.taskName.trim() : tasks[index].taskName,
        subjectId: taskData.subjectId || tasks[index].subjectId,
        deadline: taskData.deadline || tasks[index].deadline,
        priority: taskData.priority || tasks[index].priority,
        status: taskData.status !== undefined ? taskData.status : tasks[index].status
    };

    saveTasks(tasks);

    return tasks[index];
}

/**
 * Delete a task
 * @param {string} taskId - Task ID
 * @returns {boolean} True if deleted
 */
function deleteTask(taskId) {
    const tasks = loadTasks();
    const filtered = tasks.filter(t => t.taskId !== taskId);

    if (filtered.length === tasks.length) return false;

    saveTasks(filtered);
    return true;
}

/**
 * Toggle task status
 * @param {string} taskId - Task ID
 * @returns {Object|null} Updated task or null
 */
function toggleTaskStatus(taskId) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.taskId === taskId);

    if (!task) return null;

    task.status = task.status === 'Pending' ? 'Completed' : 'Pending';
    saveTasks(tasks);

    return task;
}

/**
 * Get task with subject name
 * @param {Object} task - Task object
 * @returns {Object} Task with subject name
 */
function getTaskWithSubject(task) {
    const subject = getSubjectById(task.subjectId);
    return {
        ...task,
        subjectName: subject ? subject.subjectName : 'Unknown'
    };
}

/**
 * Filter tasks based on criteria
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered tasks
 */
function filterTasks(filters = {}) {
    let tasks = loadTasks();

    // Search by task name
    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        tasks = tasks.filter(t => t.taskName.toLowerCase().includes(searchLower));
    }

    // Filter by subject
    if (filters.subjectId) {
        tasks = tasks.filter(t => t.subjectId === filters.subjectId);
    }

    // Filter by priority
    if (filters.priority) {
        tasks = tasks.filter(t => t.priority === filters.priority);
    }

    // Filter by status
    if (filters.status) {
        tasks = tasks.filter(t => t.status === filters.status);
    }

    // Sort by deadline (nearest first)
    tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    return tasks.map(getTaskWithSubject);
}

/**
 * Get tasks due today
 * @returns {Array} Tasks due today
 */
function getTasksDueToday() {
    const today = new Date().toISOString().split('T')[0];
    const tasks = loadTasks();
    return tasks
        .filter(t => t.deadline === today && t.status !== 'Completed')
        .map(getTaskWithSubject);
}

/**
 * Get upcoming tasks (not completed, sorted by deadline)
 * @param {number} limit - Maximum number of tasks to return
 * @returns {Array} Upcoming tasks
 */
function getUpcomingTasks(limit = 5) {
    const today = new Date().toISOString().split('T')[0];
    const tasks = loadTasks();
    return tasks
        .filter(t => t.status !== 'Completed')
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, limit)
        .map(getTaskWithSubject);
}

/**
 * Get overdue tasks
 * @returns {Array} Overdue tasks
 */
function getOverdueTasks() {
    const today = new Date().toISOString().split('T')[0];
    const tasks = loadTasks();
    return tasks
        .filter(t => t.deadline < today && t.status !== 'Completed')
        .map(getTaskWithSubject);
}

/**
 * Render tasks list
 * @param {Array} tasks - Tasks to render
 */
function renderTasksList(tasks = null) {
    const tasksList = document.getElementById('tasks-list');
    const tasksEmpty = document.getElementById('tasks-empty');

    if (!tasksList) return;

    if (tasks === null) {
        tasks = filterTasks(getCurrentFilters());
    }

    if (tasks.length === 0) {
        tasksList.style.display = 'none';
        tasksEmpty.style.display = 'block';
        return;
    }

    tasksList.style.display = 'flex';
    tasksEmpty.style.display = 'none';

    tasksList.innerHTML = tasks.map(task => {
        const isOverdue = task.deadline < new Date().toISOString().split('T')[0] && task.status !== 'Completed';
        const isToday = task.deadline === new Date().toISOString().split('T')[0];

        return `
        <div class="task-item ${task.status === 'Completed' ? 'completed' : ''}" data-task-id="${task.taskId}">
            <input type="checkbox" class="task-checkbox" 
                ${task.status === 'Completed' ? 'checked' : ''} 
                onchange="handleTaskCheckboxChange('${task.taskId}')"
                aria-label="Mark task as ${task.status === 'Completed' ? 'pending' : 'completed'}">
            <div class="task-info">
                <div class="task-name">${escapeHtml(task.taskName)}</div>
                <div class="task-meta">
                    <span>📚 ${escapeHtml(task.subjectName)}</span>
                    <span class="${isOverdue ? 'overdue' : ''} ${isToday ? 'today' : ''}">
                        📅 ${formatDate(task.deadline)}
                    </span>
                    <span class="priority-badge priority-${task.priority.toLowerCase()}">${task.priority}</span>
                    <span class="status-badge status-${task.status.toLowerCase()}">${task.status}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="btn btn-icon" onclick="openEditTaskModal('${task.taskId}')" aria-label="Edit task">✏️</button>
                <button class="btn btn-icon delete" onclick="openDeleteTaskModal('${task.taskId}')" aria-label="Delete task">🗑️</button>
            </div>
        </div>
    `}).join('');
}

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDate = new Date(dateString);
    taskDate.setHours(0, 0, 0, 0);

    const diffTime = taskDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays <= 7) return `In ${diffDays} days`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Get current filters from DOM
 * @returns {Object} Current filter values
 */
function getCurrentFilters() {
    const searchInput = document.getElementById('task-search');
    const subjectFilter = document.getElementById('filter-subject');
    const priorityFilter = document.getElementById('filter-priority');
    const statusFilter = document.getElementById('filter-status');

    return {
        search: searchInput ? searchInput.value : '',
        subjectId: subjectFilter ? subjectFilter.value : '',
        priority: priorityFilter ? priorityFilter.value : '',
        status: statusFilter ? statusFilter.value : ''
    };
}
