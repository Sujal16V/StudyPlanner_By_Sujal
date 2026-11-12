// ========================================
// Storage.js - LocalStorage Operations
// ========================================

const STORAGE_KEYS = {
    SUBJECTS: 'studyPlanner_subjects',
    TASKS: 'studyPlanner_tasks'
};

/**
 * Load subjects from LocalStorage
 * @returns {Array} Array of subject objects
 */
function loadSubjects() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading subjects:', error);
        return [];
    }
}

/**
 * Save subjects to LocalStorage
 * @param {Array} subjects - Array of subject objects
 */
function saveSubjects(subjects) {
    try {
        localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    } catch (error) {
        console.error('Error saving subjects:', error);
    }
}

/**
 * Load tasks from LocalStorage
 * @returns {Array} Array of task objects
 */
function loadTasks() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.TASKS);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading tasks:', error);
        return [];
    }
}

/**
 * Save tasks to LocalStorage
 * @param {Array} tasks - Array of task objects
 */
function saveTasks(tasks) {
    try {
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (error) {
        console.error('Error saving tasks:', error);
    }
}

/**
 * Generate a unique ID
 * @returns {string} Unique ID string
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Clear all data (for testing)
 */
function clearAllData() {
    localStorage.removeItem(STORAGE_KEYS.SUBJECTS);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
}

/**
 * Check if storage is empty
 * @returns {boolean} True if both subjects and tasks are empty
 */
function isStorageEmpty() {
    const subjects = loadSubjects();
    const tasks = loadTasks();
    return subjects.length === 0 && tasks.length === 0;
}
