let tasks = [];
let nextId = 1;

// Elements
const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskCards = document.getElementById('taskCards');

const editSection = document.getElementById('editSection');
const editId = document.getElementById('editId');
const editTitle = document.getElementById('editTitle');
const editDescription = document.getElementById('editDescription');
const editCompleted = document.getElementById('editCompleted');
const saveEditBtn = document.getElementById('saveEditBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

const searchInput = document.getElementById('searchInput');
let searchText = "";

// Extra feature defaults
const defaultPriority = 'Medium';

// CREATE
addTaskBtn.addEventListener('click', () => {
  const title = taskTitle.value.trim();
  const description = taskDescription.value.trim();

  if (!title) {
    alert('Title is required');
    return;
  }

  // Simple prompts for extra features (optional for user)
  const priorityInput = prompt("Enter priority (Low, Medium, High):", defaultPriority) || defaultPriority;
  const dueDateInput = prompt("Enter due date (optional, e.g. 2025-12-31):", "");

  const priority = ['low', 'medium', 'high'].includes(priorityInput.toLowerCase())
    ? capitalize(priorityInput)
    : defaultPriority;

  const newTask = {
    id: nextId++,
    title,
    description,
    completed: false,
    status: 'Pending',
    priority,
    dueDate: dueDateInput || ''
  };

  tasks.push(newTask);
  taskTitle.value = '';
  taskDescription.value = '';
  renderTasks();
});

// SEARCH – update search text on typing
searchInput.addEventListener('input', () => {
  searchText = searchInput.value.toLowerCase();
  renderTasks();
});

// Helper: capitalize first letter
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Helper: wrap matching part with <span class="highlight">
function highlightMatch(text, search) {
  if (!search) return text;
  const lowerText = text.toLowerCase();
  const lowerSearch = search.toLowerCase();
  const index = lowerText.indexOf(lowerSearch);
  if (index === -1) return text;

  const before = text.slice(0, index);
  const match = text.slice(index, index + search.length);
  const after = text.slice(index + search.length);
  return `${before}<span class="highlight">${match}</span>${after}`;
}

// READ – render cards, filtered by search and highlight matches
function renderTasks() {
  taskCards.innerHTML = '';

  const filtered = tasks.filter(t =>
    t.title.toLowerCase().includes(searchText)
  );

  filtered.forEach(task => {
    const card = document.createElement('div');
    card.className = 'task-card' + (task.completed ? ' completed' : '');

    const statusText = task.status || (task.completed ? 'Completed' : 'Pending');
    const highlightedTitle = highlightMatch(task.title, searchText);

    // Priority badge color
    let priorityClass = 'priority-medium';
    if (task.priority === 'High') priorityClass = 'priority-high';
    if (task.priority === 'Low') priorityClass = 'priority-low';

    const due = task.dueDate ? `Due: ${task.dueDate}` : 'No due date';

    card.innerHTML = `
      <h3>${highlightedTitle}</h3>
      <p>${task.description || 'No description'}</p>
      <div class="task-status">Status: ${statusText}</div>
      <div class="task-meta">
        <span class="priority-badge ${priorityClass}">${task.priority}</span>
        <span class="due-date">${due}</span>
      </div>
      <div class="card-buttons">
        <button class="mark-btn">${task.completed ? 'Mark Pending' : 'Mark Complete'}</button>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    const markBtn = card.querySelector('.mark-btn');
    const editBtn = card.querySelector('.edit-btn');
    const deleteBtn = card.querySelector('.delete-btn');

    markBtn.addEventListener('click', () => toggleComplete(task.id));
    editBtn.addEventListener('click', () => startEditTask(task.id));
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    taskCards.appendChild(card);
  });
}

// Toggle complete / pending using button
function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.completed = !task.completed;
  task.status = task.completed ? 'Completed' : 'Pending';
  renderTasks();
}

// UPDATE – open edit
function startEditTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  editId.value = task.id;
  editTitle.value = task.title;
  editDescription.value = task.description;
  editCompleted.checked = task.completed;

  editSection.classList.remove('hidden');
}

// UPDATE – save changes (also update status)
saveEditBtn.addEventListener('click', () => {
  const id = parseInt(editId.value, 10);
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const newTitle = editTitle.value.trim();
  const newDescription = editDescription.value.trim();

  if (newTitle) {
    task.title = newTitle;
  }
  task.description = newDescription;
  task.completed = editCompleted.checked;
  task.status = task.completed ? 'Completed' : 'Pending';

  editSection.classList.add('hidden');
  renderTasks();
});

// Cancel edit
cancelEditBtn.addEventListener('click', () => {
  editSection.classList.add('hidden');
});

// DELETE
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
}

// Initial render
renderTasks();
