let currentUser = null;

window.onload = () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);

  document.getElementById('themeToggle').onclick = () => {
    const newTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
    setTheme(newTheme);
  };
};

function setTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
  localStorage.setItem('theme', theme);
}

function register() {
  const login = document.getElementById('loginInput').value.trim();
  const password = document.getElementById('passwordInput').value;

  const messageEl = document.getElementById('authMessage');
  messageEl.textContent = '';

  if (!login || !password) {
    messageEl.textContent = 'Введите логин и пароль!';
    return;
  }

  let users = JSON.parse(localStorage.getItem('users') || '{}');
  if (users[login]) {
    messageEl.textContent = 'Пользователь уже существует!';
    return;
  }

  users[login] = {
    password,
    tasks: []
  };
  localStorage.setItem('users', JSON.stringify(users));
  messageEl.style.color = 'green';
  messageEl.textContent = 'Регистрация успешна! Теперь войдите.';
}

function login() {
  const login = document.getElementById('loginInput').value.trim();
  const password = document.getElementById('passwordInput').value;

  const messageEl = document.getElementById('authMessage');
  messageEl.textContent = '';

  let users = JSON.parse(localStorage.getItem('users') || '{}');
  const user = users[login];

  if (!user || user.password !== password) {
    messageEl.style.color = '#dc3545';
    messageEl.textContent = 'Неверный логин или пароль!';
    return;
  }

  currentUser = login;
  messageEl.textContent = '';
  showTodoApp();
  loadTasks();
}

function showTodoApp() {
  document.getElementById('authSection').style.display = 'none';
  document.getElementById('todoSection').style.display = 'flex';
  document.getElementById('usernameDisplay').textContent = currentUser;
}

function logout() {
  currentUser = null;
  document.getElementById('authSection').style.display = 'flex';
  document.getElementById('todoSection').style.display = 'none';
  clearTasksUI();
}

function addTask() {
  const input = document.getElementById('taskInput');
  const text = input.value.trim();
  if (!text) return;

  let users = JSON.parse(localStorage.getItem('users') || '{}');
  users[currentUser].tasks.push({ text, done: false });
  localStorage.setItem('users', JSON.stringify(users));

  input.value = '';
  loadTasks();
}

function loadTasks() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';

  const users = JSON.parse(localStorage.getItem('users') || '{}');
  const tasks = users[currentUser].tasks;

  let completedCount = 0;

  tasks.forEach((task, idx) => {
    const li = document.createElement('li');
    li.textContent = task.text;
    if (task.done) {
      li.classList.add('completed');
      completedCount++;
    }
    li.onclick = () => toggleTaskDone(idx);

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Удалить';
    delBtn.onclick = e => {
      e.stopPropagation();
      deleteTask(idx);
    };

    li.appendChild(delBtn);
    list.appendChild(li);
  });

  document.getElementById('totalTasks').textContent = tasks.length;
  document.getElementById('completedTasks').textContent = completedCount;
}

function clearTasksUI() {
  document.getElementById('taskList').innerHTML = '';
  document.getElementById('totalTasks').textContent = '0';
  document.getElementById('completedTasks').textContent = '0';
}

function toggleTaskDone(idx) {
  let users = JSON.parse(localStorage.getItem('users') || '{}');
  let tasks = users[currentUser].tasks;
  tasks[idx].done = !tasks[idx].done;
  localStorage.setItem('users', JSON.stringify(users));
  loadTasks();
}

function deleteTask(idx) {
  let users = JSON.parse(localStorage.getItem('users') || '{}');
  let tasks = users[currentUser].tasks;
  tasks.splice(idx, 1);
  localStorage.setItem('users', JSON.stringify(users));
  loadTasks();
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}
