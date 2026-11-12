// ========================================
// Subjects.js - Subject Management
// ========================================

/**
 * Get all subjects
 * @returns {Array} Array of subjects
 */
function getSubjects() {
    return loadSubjects();
}

/**
 * Get subject by ID
 * @param {string} subjectId - Subject ID
 * @returns {Object|null} Subject object or null
 */
function getSubjectById(subjectId) {
    const subjects = loadSubjects();
    return subjects.find(s => s.subjectId === subjectId) || null;
}

/**
 * Add a new subject
 * @param {string} subjectName - Name of the subject
 * @returns {Object} Created subject
 */
function addSubject(subjectName) {
    const subjects = loadSubjects();

    const newSubject = {
        subjectId: generateId(),
        subjectName: subjectName.trim(),
        createdDate: new Date().toISOString()
    };

    subjects.push(newSubject);
    saveSubjects(subjects);

    return newSubject;
}

/**
 * Update a subject
 * @param {string} subjectId - Subject ID
 * @param {string} subjectName - New subject name
 * @returns {Object|null} Updated subject or null
 */
function updateSubject(subjectId, subjectName) {
    const subjects = loadSubjects();
    const index = subjects.findIndex(s => s.subjectId === subjectId);

    if (index === -1) return null;

    subjects[index].subjectName = subjectName.trim();
    saveSubjects(subjects);

    return subjects[index];
}

/**
 * Delete a subject
 * @param {string} subjectId - Subject ID
 * @returns {boolean} True if deleted
 */
function deleteSubject(subjectId) {
    const subjects = loadSubjects();
    const filtered = subjects.filter(s => s.subjectId !== subjectId);

    if (filtered.length === subjects.length) return false;

    saveSubjects(filtered);

    // Also delete associated tasks
    const tasks = loadTasks();
    const filteredTasks = tasks.filter(t => t.subjectId !== subjectId);
    saveTasks(filteredTasks);

    return true;
}

/**
 * Get subject with task statistics
 * @param {Object} subject - Subject object
 * @returns {Object} Subject with stats
 */
function getSubjectWithStats(subject) {
    const tasks = loadTasks();
    const subjectTasks = tasks.filter(t => t.subjectId === subject.subjectId);
    const completedTasks = subjectTasks.filter(t => t.status === 'Completed').length;
    const totalTasks = subjectTasks.length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
        ...subject,
        totalTasks,
        completedTasks,
        progress
    };
}

/**
 * Get all subjects with statistics
 * @returns {Array} Array of subjects with stats
 */
function getAllSubjectsWithStats() {
    const subjects = getSubjects();
    return subjects.map(getSubjectWithStats);
}

/**
 * Render subjects grid
 */
function renderSubjects() {
    const subjectsList = document.getElementById('subjects-list');
    const subjectsEmpty = document.getElementById('subjects-empty');

    if (!subjectsList) return;

    const subjects = getAllSubjectsWithStats();

    if (subjects.length === 0) {
        subjectsList.style.display = 'none';
        subjectsEmpty.style.display = 'block';
        return;
    }

    subjectsList.style.display = 'grid';
    subjectsEmpty.style.display = 'none';

    subjectsList.innerHTML = subjects.map(subject => `
        <div class="subject-card" data-subject-id="${subject.subjectId}">
            <div class="subject-card-header">
                <h3 class="subject-card-title">${escapeHtml(subject.subjectName)}</h3>
                <div class="subject-card-actions">
                    <button class="btn btn-icon" onclick="openEditSubjectModal('${subject.subjectId}')" aria-label="Edit subject">✏️</button>
                    <button class="btn btn-icon delete" onclick="openDeleteSubjectModal('${subject.subjectId}')" aria-label="Delete subject">🗑️</button>
                </div>
            </div>
            <div class="subject-stats">
                <span>${subject.totalTasks} tasks</span>
                <span>${subject.completedTasks} completed</span>
            </div>
            <div class="subject-progress-bar">
                <div class="subject-progress-fill" style="width: ${subject.progress}%"></div>
            </div>
            <div class="subject-progress-text">${subject.progress}% complete</div>
        </div>
    `).join('');
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
