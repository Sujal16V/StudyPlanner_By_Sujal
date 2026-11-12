# Study Planner – Personal Academic Task Management System

A modern, lightweight web application for students to organize academic subjects, track study tasks, monitor deadlines, and plan their study schedule.

## Features

### Dashboard
- Overview statistics (total subjects, tasks, completed, pending)
- Overall progress tracking with visual progress bar
- Upcoming deadlines list
- Today's tasks
- Subject-wise progress breakdown

### Subject Management
- Add, edit, and delete subjects
- View task count and completion progress per subject
- Visual progress bars for each subject
- Confirmation dialog when deleting subjects with tasks

### Task Management
- Create tasks with name, subject, deadline, priority, and status
- Edit and delete tasks
- Mark tasks as completed/pending with checkbox
- Priority levels: High, Medium, Low
- Status: Pending, Completed
- Visual distinction for completed tasks

### Search and Filters
- Search tasks by name
- Filter by subject, priority, and status
- Combine multiple filters
- Clear all filters option

### Daily/Weekly Planner
- Today's tasks view
- Upcoming tasks (next 7 days)
- Weekly calendar view with tasks grouped by day
- Automatic derivation from task data

### Data Persistence
- All data stored in browser LocalStorage
- Data persists across browser refreshes
- No backend or database required
- Optional demo data loader

### Modern UI/UX
- Clean, minimal design inspired by modern productivity apps
- Responsive layout for desktop, tablet, and mobile
- Smooth interactions and transitions
- Accessible with proper focus states and ARIA labels
- Empty states with helpful messages

## Technology Stack

- **HTML5** – Semantic markup
- **CSS3** – Modern styling with CSS variables, Flexbox, Grid
- **Vanilla JavaScript (ES6+)** – No frameworks or libraries
- **Browser LocalStorage** – Client-side data persistence

### What's NOT Used
- No React, Angular, Vue, or other frameworks
- No Node.js or backend server
- No databases (MySQL, MongoDB, Firebase, etc.)
- No authentication system
- No external APIs

## Folder Structure

```
study-planner/
│
├── index.html          # Main HTML file
├── css/
│   └── style.css       # All styles
├── js/
│   ├── storage.js      # LocalStorage operations
│   ├── subjects.js     # Subject CRUD operations
│   ├── tasks.js        # Task CRUD operations and filtering
│   ├── dashboard.js    # Dashboard statistics and rendering
│   ├── planner.js      # Daily/weekly planner logic
│   └── app.js          # Main application logic and initialization
└── README.md           # This file
```

## How to Run

1. **Download** the project folder
2. **Open** `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari)
3. **Start using** the application immediately

No installation, no server setup, no build process required.

## How LocalStorage Works

The application uses two LocalStorage keys:

- `studyPlanner_subjects` – Stores array of subject objects
- `studyPlanner_tasks` – Stores array of task objects

### Data Structure

**Subject Object:**
```javascript
{
  subjectId: "unique-id-string",
  subjectName: "Subject Name",
  createdDate: "2026-09-23T12:00:00.000Z"
}
```

**Task Object:**
```javascript
{
  taskId: "unique-id-string",
  taskName: "Task Name",
  subjectId: "linked-subject-id",
  deadline: "2026-09-30",
  priority: "High",
  status: "Pending",
  createdDate: "2026-09-23T12:00:00.000Z"
}
```

### Storage Functions

- `loadSubjects()` / `saveSubjects()` – Read/write subjects
- `loadTasks()` / `saveTasks()` – Read/write tasks
- `generateId()` – Create unique IDs
- `isStorageEmpty()` – Check if storage is empty

## Testing Checklist

### Subject Management
- [x] Add new subject
- [x] Edit subject name
- [x] Delete subject (empty)
- [x] Delete subject with tasks (shows warning)
- [x] Subject cards display correct task count and progress

### Task Management
- [x] Add new task
- [x] Edit task details
- [x] Delete task
- [x] Mark task as completed (checkbox)
- [x] Reopen completed task
- [x] Set priority (High/Medium/Low)
- [x] Set deadline
- [x] Task displays correct subject name

### Search and Filters
- [x] Search by task name
- [x] Filter by subject
- [x] Filter by priority
- [x] Filter by status
- [x] Combine multiple filters
- [x] Clear filters button

### Dashboard
- [x] Statistics update after adding/deleting tasks
- [x] Overall progress percentage correct
- [x] Upcoming deadlines sorted correctly
- [x] Today's tasks displayed
- [x] Subject-wise progress accurate

### Planner
- [x] Today's tasks shown
- [x] Upcoming tasks (next 7 days) shown
- [x] Weekly view displays tasks by day
- [x] Empty state when no tasks

### Data Persistence
- [x] Data survives browser refresh
- [x] Empty LocalStorage handled gracefully
- [x] Demo data loads correctly

### Responsive Design
- [x] Desktop layout
- [x] Tablet layout
- [x] Mobile layout
- [x] Navigation adapts to screen size

### UI/UX
- [x] Empty states display helpful messages
- [x] Modals work correctly
- [x] Form validation prevents empty submissions
- [x] Delete confirmations show appropriate warnings
- [x] Completed tasks visually distinguished

## Limitations

1. **Single-user only** – No multi-user support or authentication
2. **Browser-specific** – Data stored per browser; not synced across devices
3. **No cloud backup** – Clearing browser data deletes all tasks
4. **No notifications** – No deadline reminders or alerts
5. **No file attachments** – Cannot attach notes or documents to tasks
6. **No recurring tasks** – Each task is one-time only

## Future Enhancements (Optional)

- Export/import data as JSON
- Task categories or tags
- Task notes or descriptions
- Pomodoro timer integration
- Study session tracking
- Dark mode toggle
- Print-friendly view
- Keyboard shortcuts

## Browser Compatibility

Tested and working on:
- Google Chrome (latest)
- Mozilla Firefox (latest)
- Microsoft Edge (latest)
- Safari (latest)

Requires ES6+ JavaScript support (all modern browsers).

## License

This project is created for educational purposes. Feel free to use and modify for your own learning.

---

**Built By Sujal Soans using only HTML, CSS, and Vanilla JavaScript**
