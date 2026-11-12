// ========================================
// App.js - Main Application Logic
// ========================================

// Modal state
let currentDeleteCallback = null;

/**
 * Initialize the application
 */
function initApp() {
    // Setup navigation
    setupNavigation();

    // Setup modals
    setupModals();

    // Setup forms
    setupForms();

    // Setup filters
    setupFilters();

    // Setup demo data button
    setupDemoData();

    // Initial render
    renderAll();
}

/**
 * Render all sections
 */
function renderAll() {
    renderDashboard();
    renderSubjects();
    renderTasksList();
    renderPlanner();
    updateSubjectFilter();
}

/**
 * Setup navigation between sections
 */
function setupNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;

            // Update active nav button
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show corresponding section
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            document.getElementById(section).classList.add('active');

            // Re-render the section
            if (section === 'dashboard') renderDashboard();
            if (section === 'subjects') renderSubjects();
            if (section === 'tasks') renderTasksList();
            if (section === 'planner') renderPlanner();
        });
    });
}

/**
 * Setup modal functionality
 */
function setupModals() {
    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', closeAllModals);
    });

    // Close modals on X button
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeAllModals);
    });

    // Close modals on Cancel button
    document.querySelectorAll('.modal-cancel').forEach(cancelBtn => {
        cancelBtn.addEventListener('click', closeAllModals);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

/**
 * Close all modals
 */
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    });
    currentDeleteCallback = null;
}

/**
 * Open a specific modal
 * @param {string} modalId - Modal ID
 */
function openModal(modalId) {
    closeAllModals();
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
    }
}

/**
 * Setup form submissions
 */
function setupForms() {
    // Subject form
    const subjectForm = document.getElementById('subject-form');
    if (subjectForm) {
        subjectForm.addEventListener('submit', handleSubjectSubmit);
    }

    // Task form
    const taskForm = document.getElementById('task-form');
    if (taskForm) {
        taskForm.addEventListener('submit', handleTaskSubmit);
    }

    // Delete confirmation
    const confirmDeleteBtn = document.getElementById('btn-confirm-delete');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            if (currentDeleteCallback) {
                currentDeleteCallback();
            }
            closeAllModals();
        });
    }
}

/**
 * Setup filters
 */
function setupFilters() {
    const searchInput = document.getElementById('task-search');
    const subjectFilter = document.getElementById('filter-subject');
    const priorityFilter = document.getElementById('filter-priority');
    const statusFilter = document.getElementById('filter-status');
    const clearFiltersBtn = document.getElementById('btn-clear-filters');

    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            renderTasksList();
        });
    }

    // Filter selects
    [subjectFilter, priorityFilter, statusFilter].forEach(select => {
        if (select) {
            select.addEventListener('change', () => {
                renderTasksList();
            });
        }
    });

    // Clear filters
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (subjectFilter) subjectFilter.value = '';
            if (priorityFilter) priorityFilter.value = '';
            if (statusFilter) statusFilter.value = '';
            renderTasksList();
        });
    }
}

/**
 * Setup demo data button
 */
function setupDemoData() {
    const demoBtn = document.getElementById('btn-load-demo-data');
    if (demoBtn) {
        demoBtn.addEventListener('click', loadDemoData);
    }

    // Also setup empty state buttons
    const emptySubjectBtns = document.querySelectorAll('#btn-add-subject-empty, #btn-add-subject-empty-subjects');
    emptySubjectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            openAddSubjectModal();
        });
    });

    // Quick add task buttons
    const quickTaskBtns = document.querySelectorAll('#btn-add-task-quick, #btn-add-task');
    quickTaskBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            openAddTaskModal();
        });
    });
}

/**
 * Update subject filter dropdown
 */
function updateSubjectFilter() {
    const select = document.getElementById('filter-subject');
    const taskSelect = document.getElementById('task-subject');

    if (!select && !taskSelect) return;

    const subjects = getSubjects();

    const options = '<option value="">All Subjects</option>' + 
        subjects.map(s => `<option value="${s.subjectId}">${escapeHtml(s.subjectName)}</option>`).join('');

    const taskOptions = '<option value="">Select a subject</option>' + 
        subjects.map(s => `<option value="${s.subjectId}">${escapeHtml(s.subjectName)}</option>`).join('');

    if (select) select.innerHTML = options;
    if (taskSelect) taskSelect.innerHTML = taskOptions;
}

/**
 * Handle subject form submission
 * @param {Event} e - Submit event
 */
function handleSubjectSubmit(e) {
    e.preventDefault();

    const subjectId = document.getElementById('subject-id').value;
    const subjectName = document.getElementById('subject-name').value.trim();

    if (!subjectName) {
        alert('Please enter a subject name');
        return;
    }

    if (subjectId) {
        // Edit existing
        updateSubject(subjectId, subjectName);
    } else {
        // Add new
        addSubject(subjectName);
    }

    closeAllModals();
    renderAll();
}

/**
 * Handle task form submission
 * @param {Event} e - Submit event
 */
function handleTaskSubmit(e) {
    e.preventDefault();

    const taskId = document.getElementById('task-id').value;
    const taskName = document.getElementById('task-name').value.trim();
    const subjectId = document.getElementById('task-subject').value;
    const deadline = document.getElementById('task-deadline').value;
    const priority = document.getElementById('task-priority').value;
    const status = document.getElementById('task-status').value;

    if (!taskName) {
        alert('Please enter a task name');
        return;
    }

    if (!subjectId) {
        alert('Please select a subject');
        return;
    }

    if (!deadline) {
        alert('Please select a deadline');
        return;
    }

    if (!priority) {
        alert('Please select a priority');
        return;
    }

    const taskData = { taskName, subjectId, deadline, priority, status };

    if (taskId) {
        // Edit existing
        updateTask(taskId, taskData);
    } else {
        // Add new
        addTask(taskData);
    }

    closeAllModals();
    renderAll();
}

/**
 * Handle task checkbox change
 * @param {string} taskId - Task ID
 */
function handleTaskCheckboxChange(taskId) {
    toggleTaskStatus(taskId);
    renderAll();
}

// Subject Modal Functions
function openAddSubjectModal() {
    document.getElementById('subject-modal-title').textContent = 'Add Subject';
    document.getElementById('subject-id').value = '';
    document.getElementById('subject-name').value = '';
    openModal('subject-modal');
}

function openEditSubjectModal(subjectId) {
    const subject = getSubjectById(subjectId);
    if (!subject) return;

    document.getElementById('subject-modal-title').textContent = 'Edit Subject';
    document.getElementById('subject-id').value = subject.subjectId;
    document.getElementById('subject-name').value = subject.subjectName;
    openModal('subject-modal');
}

function openDeleteSubjectModal(subjectId) {
    const subject = getSubjectById(subjectId);
    if (!subject) return;

    const tasks = loadTasks().filter(t => t.subjectId === subjectId);
    const taskCount = tasks.length;

    let message = `Are you sure you want to delete "${escapeHtml(subject.subjectName)}"?`;
    if (taskCount > 0) {
        message += `\n\nThis subject has ${taskCount} associated task${taskCount > 1 ? 's' : ''}. Deleting it will also remove those tasks.`;
    }

    document.getElementById('delete-modal-title').textContent = 'Delete Subject?';
    document.getElementById('delete-modal-message').textContent = message;
    currentDeleteCallback = () => {
        deleteSubject(subjectId);
        renderAll();
    };
    openModal('delete-modal');
}

// Task Modal Functions
function openAddTaskModal() {
    const subjects = getSubjects();
    if (subjects.length === 0) {
        alert('Please add a subject first before creating tasks.');
        return;
    }

    document.getElementById('task-modal-title').textContent = 'Add Task';
    document.getElementById('task-id').value = '';
    document.getElementById('task-name').value = '';
    document.getElementById('task-subject').value = '';
    document.getElementById('task-deadline').value = '';
    document.getElementById('task-priority').value = '';
    document.getElementById('task-status').value = 'Pending';

    updateSubjectFilter();
    openModal('task-modal');
}

function openEditTaskModal(taskId) {
    const task = getTaskById(taskId);
    if (!task) return;

    const subjects = getSubjects();
    if (subjects.length === 0) {
        alert('No subjects available');
        return;
    }

    document.getElementById('task-modal-title').textContent = 'Edit Task';
    document.getElementById('task-id').value = task.taskId;
    document.getElementById('task-name').value = task.taskName;

    updateSubjectFilter();
    document.getElementById('task-subject').value = task.subjectId;
    document.getElementById('task-deadline').value = task.deadline;
    document.getElementById('task-priority').value = task.priority;
    document.getElementById('task-status').value = task.status;

    openModal('task-modal');
}

function openDeleteTaskModal(taskId) {
    const task = getTaskById(taskId);
    if (!task) return;

    document.getElementById('delete-modal-title').textContent = 'Delete Task?';
    document.getElementById('delete-modal-message').textContent = 
        `Are you sure you want to delete "${escapeHtml(task.taskName)}"?`;
    currentDeleteCallback = () => {
        deleteTask(taskId);
        renderAll();
    };
    openModal('delete-modal');
}

/**
 * Load demo data
 */
function loadDemoData() {
    // Demo subjects
    const demoSubjects = [
        { subjectId: 'demo1', subjectName: 'Data Structures', createdDate: new Date().toISOString() },
        { subjectId: 'demo2', subjectName: 'Java Programming', createdDate: new Date().toISOString() },
        { subjectId: 'demo3', subjectName: 'Web Technology', createdDate: new Date().toISOString() },
        { subjectId: 'demo4', subjectName: 'Software Engineering', createdDate: new Date().toISOString() }
    ];

    // Demo tasks
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const in3Days = new Date(today);
    in3Days.setDate(in3Days.getDate() + 3);
    const in5Days = new Date(today);
    in5Days.setDate(in5Days.getDate() + 5);
    const in7Days = new Date(today);
    in7Days.setDate(in7Days.getDate() + 7);

    const demoTasks = [
        { taskId: 't1', taskName: 'Complete Unit 3 Notes', subjectId: 'demo1', deadline: today.toISOString().split('T')[0], priority: 'High', status: 'Pending', createdDate: new Date().toISOString() },
        { taskId: 't2', taskName: 'Practice Sorting Problems', subjectId: 'demo1', deadline: tomorrow.toISOString().split('T')[0], priority: 'Medium', status: 'Pending', createdDate: new Date().toISOString() },
        { taskId: 't3', taskName: 'Prepare Java Lab Program', subjectId: 'demo2', deadline: in3Days.toISOString().split('T')[0], priority: 'High', status: 'Pending', createdDate: new Date().toISOString() },
        { taskId: 't4', taskName: 'Complete Web Technology Assignment', subjectId: 'demo3', deadline: in5Days.toISOString().split('T')[0], priority: 'Medium', status: 'Pending', createdDate: new Date().toISOString() },
        { taskId: 't5', taskName: 'Study Software Engineering Unit 2', subjectId: 'demo4', deadline: in7Days.toISOString().split('T')[0], priority: 'Low', status: 'Pending', createdDate: new Date().toISOString() }
    ];

    saveSubjects(demoSubjects);
    saveTasks(demoTasks);

    renderAll();
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initApp);
