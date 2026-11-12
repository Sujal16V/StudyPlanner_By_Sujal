// ========================================
// Dashboard.js - Dashboard Statistics and Progress
// ========================================

/**
 * Calculate dashboard statistics
 * @returns {Object} Statistics object
 */
function calculateStats() {
    const subjects = loadSubjects();
    const tasks = loadTasks();

    const totalSubjects = subjects.length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const pendingTasks = totalTasks - completedTasks;
    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
        totalSubjects,
        totalTasks,
        completedTasks,
        pendingTasks,
        overallProgress
    };
}

/**
 * Render dashboard statistics
 */
function renderDashboardStats() {
    const stats = calculateStats();

    const totalSubjectsEl = document.getElementById('total-subjects');
    const totalTasksEl = document.getElementById('total-tasks');
    const completedTasksEl = document.getElementById('completed-tasks');
    const pendingTasksEl = document.getElementById('pending-tasks');
    const overallProgressFill = document.getElementById('overall-progress-fill');
    const overallProgressPercentage = document.getElementById('overall-progress-percentage');
    const dashboardEmpty = document.getElementById('dashboard-empty');
    const demoDataSection = document.getElementById('demo-data-section');

    if (totalSubjectsEl) totalSubjectsEl.textContent = stats.totalSubjects;
    if (totalTasksEl) totalTasksEl.textContent = stats.totalTasks;
    if (completedTasksEl) completedTasksEl.textContent = stats.completedTasks;
    if (pendingTasksEl) pendingTasksEl.textContent = stats.pendingTasks;

    if (overallProgressFill) {
        overallProgressFill.style.width = `${stats.overallProgress}%`;
    }
    if (overallProgressPercentage) {
        overallProgressPercentage.textContent = `${stats.overallProgress}%`;
    }

    // Show empty state if no subjects
    if (stats.totalSubjects === 0) {
        if (dashboardEmpty) dashboardEmpty.style.display = 'block';
    } else {
        if (dashboardEmpty) dashboardEmpty.style.display = 'none';
    }

    // Show demo data button if storage is empty
    if (isStorageEmpty()) {
        if (demoDataSection) demoDataSection.style.display = 'block';
    } else {
        if (demoDataSection) demoDataSection.style.display = 'none';
    }
}

/**
 * Render upcoming deadlines
 */
function renderUpcomingDeadlines() {
    const container = document.getElementById('upcoming-deadlines-list');
    if (!container) return;

    const tasks = getUpcomingTasks(5);

    if (tasks.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); padding: 0.5rem;">No upcoming deadlines</p>';
        return;
    }

    const today = new Date().toISOString().split('T')[0];

    container.innerHTML = tasks.map(task => {
        const isOverdue = task.deadline < today;
        const isToday = task.deadline === today;

        return `
        <div class="task-item-compact ${task.status === 'Completed' ? 'completed' : ''}">
            <span class="task-name-compact">${escapeHtml(task.taskName)}</span>
            <span class="task-deadline-compact ${isOverdue ? 'overdue' : ''} ${isToday ? 'today' : ''}">
                ${formatDate(task.deadline)}
            </span>
        </div>
    `}).join('');
}

/**
 * Render today's tasks
 */
function renderTodaysTasks() {
    const container = document.getElementById('todays-tasks-list');
    if (!container) return;

    const tasks = getTasksDueToday();

    if (tasks.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); padding: 0.5rem;">No tasks due today</p>';
        return;
    }

    container.innerHTML = tasks.map(task => `
        <div class="task-item-compact ${task.status === 'Completed' ? 'completed' : ''}" onclick="handleTaskCheckboxChange('${task.taskId}')" style="cursor: pointer;">
            <span class="task-name-compact">${escapeHtml(task.taskName)}</span>
            <span class="task-deadline-compact today">Today</span>
        </div>
    `).join('');
}

/**
 * Render subject-wise progress
 */
function renderSubjectProgress() {
    const container = document.getElementById('subject-progress-list');
    if (!container) return;

    const subjects = getAllSubjectsWithStats();

    if (subjects.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); padding: 0.5rem; grid-column: 1/-1;">No subjects yet</p>';
        return;
    }

    container.innerHTML = subjects.map(subject => `
        <div class="subject-progress-item">
            <div class="subject-progress-name">${escapeHtml(subject.subjectName)}</div>
            <div class="subject-progress-bar">
                <div class="subject-progress-fill" style="width: ${subject.progress}%"></div>
            </div>
            <div class="subject-progress-stats">${subject.completedTasks}/${subject.totalTasks} tasks (${subject.progress}%)</div>
        </div>
    `).join('');
}

/**
 * Render complete dashboard
 */
function renderDashboard() {
    renderDashboardStats();
    renderUpcomingDeadlines();
    renderTodaysTasks();
    renderSubjectProgress();
}
