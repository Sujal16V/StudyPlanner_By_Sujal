// ========================================
// Planner.js - Daily and Weekly Planner
// ========================================

/**
 * Get tasks grouped by date for the planner
 * @returns {Object} Tasks grouped by date
 */
function getPlannerData() {
    const tasks = loadTasks().filter(t => t.status !== 'Completed');
    const today = new Date().toISOString().split('T')[0];

    const todayTasks = [];
    const upcomingTasks = [];
    const weeklyTasks = {};

    // Initialize this week's days
    const weekDays = getWeekDays();
    weekDays.forEach(day => {
        weeklyTasks[day.date] = {
            dayName: day.dayName,
            date: day.date,
            tasks: []
        };
    });

    tasks.forEach(task => {
        const taskWithSubject = getTaskWithSubject(task);

        // Today's tasks
        if (task.deadline === today) {
            todayTasks.push(taskWithSubject);
        }

        // Upcoming tasks (next 7 days, not including today)
        const taskDate = new Date(task.deadline);
        const todayDate = new Date(today);
        const diffDays = Math.ceil((taskDate - todayDate) / (1000 * 60 * 60 * 24));

        if (diffDays > 0 && diffDays <= 7) {
            upcomingTasks.push(taskWithSubject);
        }

        // Weekly view
        if (weeklyTasks[task.deadline]) {
            weeklyTasks[task.deadline].tasks.push(taskWithSubject);
        }
    });

    // Sort upcoming tasks by deadline
    upcomingTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    return {
        today: todayTasks,
        upcoming: upcomingTasks,
        weekly: Object.values(weeklyTasks)
    };
}

/**
 * Get this week's days (Monday to Sunday)
 * @returns {Array} Array of day objects
 */
function getWeekDays() {
    const days = [];
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust to Monday

    const monday = new Date(today.setDate(diff));

    for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        days.push({ date: dateStr, dayName });
    }

    return days;
}

/**
 * Render planner sections
 */
function renderPlanner() {
    const plannerData = getPlannerData();
    const plannerEmpty = document.getElementById('planner-empty');

    const hasTasks = plannerData.today.length > 0 || 
                     plannerData.upcoming.length > 0 || 
                     plannerData.weekly.some(day => day.tasks.length > 0);

    if (!hasTasks) {
        if (plannerEmpty) plannerEmpty.style.display = 'block';
        // Hide all planner sections
        ['planner-today', 'planner-upcoming', 'planner-weekly'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = '';
        });
        return;
    }

    if (plannerEmpty) plannerEmpty.style.display = 'none';

    // Render Today
    renderPlannerToday(plannerData.today);

    // Render Upcoming
    renderPlannerUpcoming(plannerData.upcoming);

    // Render Weekly
    renderPlannerWeekly(plannerData.weekly);
}

/**
 * Render today's tasks
 * @param {Array} tasks - Today's tasks
 */
function renderPlannerToday(tasks) {
    const container = document.getElementById('planner-today');
    if (!container) return;

    if (tasks.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); padding: 0.5rem;">No tasks due today</p>';
        return;
    }

    container.innerHTML = tasks.map(task => `
        <div class="planner-task-item ${task.status === 'Completed' ? 'completed' : ''}" 
             onclick="handleTaskCheckboxChange('${task.taskId}')" 
             style="cursor: pointer;">
            <strong>${escapeHtml(task.taskName)}</strong><br>
            <small>📚 ${escapeHtml(task.subjectName)} • <span class="priority-badge priority-${task.priority.toLowerCase()}">${task.priority}</span></small>
        </div>
    `).join('');
}

/**
 * Render upcoming tasks
 * @param {Array} tasks - Upcoming tasks
 */
function renderPlannerUpcoming(tasks) {
    const container = document.getElementById('planner-upcoming');
    if (!container) return;

    if (tasks.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); padding: 0.5rem;">No upcoming tasks</p>';
        return;
    }

    container.innerHTML = tasks.map(task => `
        <div class="planner-task-item ${task.status === 'Completed' ? 'completed' : ''}" 
             onclick="handleTaskCheckboxChange('${task.taskId}')" 
             style="cursor: pointer;">
            <strong>${escapeHtml(task.taskName)}</strong><br>
            <small>📅 ${formatDate(task.deadline)} • 📚 ${escapeHtml(task.subjectName)}</small>
        </div>
    `).join('');
}

/**
 * Render weekly view
 * @param {Array} weeklyData - Weekly data
 */
function renderPlannerWeekly(weeklyData) {
    const container = document.getElementById('planner-weekly');
    if (!container) return;

    const today = new Date().toISOString().split('T')[0];

    container.innerHTML = weeklyData.map(day => {
        const isToday = day.date === today;
        const hasTasks = day.tasks.length > 0;

        return `
        <div class="planner-day-card ${isToday ? 'today' : ''}" style="${isToday ? 'border: 2px solid var(--primary-color);' : ''}">
            <div class="planner-day-card-header">
                ${day.dayName} ${isToday ? '• Today' : ''}
            </div>
            <div class="planner-day-card-tasks">
                ${hasTasks 
                    ? day.tasks.map(task => `
                        <div class="planner-task-item ${task.status === 'Completed' ? 'completed' : ''}" 
                             onclick="handleTaskCheckboxChange('${task.taskId}')" 
                             style="cursor: pointer;">
                            ${escapeHtml(task.taskName)}
                        </div>
                    `).join('')
                    : '<p style="color: var(--text-secondary); font-size: 0.875rem;">No tasks</p>'
                }
            </div>
        </div>
    `}).join('');
}
