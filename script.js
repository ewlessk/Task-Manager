const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const formError = document.getElementById("form-error");
const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");
const headerTotal = document.getElementById("header-total");
const statsTotal = document.getElementById("stats-total");
const statsCompleted = document.getElementById("stats-completed");
const statsActive = document.getElementById("stats-active");
const resetButton = document.getElementById("reset-button");
const searchInput = document.getElementById("search-input");
const filtersBox = document.getElementById("filters");
const sortSelect = document.getElementById("sort-select");
const initialTasks = [
  {
    id: 1,
    title: "Прогуляться",
    isCompleted: false,
  },
  {
    id: 2,
    title: "Разобрать письма",
    isCompleted: true,
  },
  {
    id: 3,
    title: "Потренить",
    isCompleted: true,
  },
];
let tasks = initialTasks.map((task) => ({ ...task }));
let searchQuery = "";
let currentFilter = "all";
let currentSort = "default";
let searchTimer;

let nextId =
  tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1;

const generateId = () => nextId++;

const createTask = (title) => {
  const cleanTitle = title.trim();
  if (!cleanTitle) {
    return { success: false, error: "Название не может быть пустым" };
  }

  const newTask = {
    id: generateId(),
    title: cleanTitle,
    isCompleted: false,
  };

  tasks.unshift(newTask);
  return { success: true, task: newTask };
};

const deleteTask = (id) => {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    return { success: false, error: "Задача не найдена" };
  }

  tasks.splice(index, 1);
  return { success: true };
};

const toggleTaskStatus = (id) => {
  const task = getTaskById(id);
  if (!task) {
    return { success: false, error: "Задача не найдена" };
  }

  task.isCompleted = !task.isCompleted;
  return { success: true, task };
};

const getStats = () => {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.isCompleted).length;
  return { total, completed, active: total - completed };
};

const getTasksByFilter = (filter) => {
  switch (filter) {
    case "completed":
      return tasks.filter((task) => task.isCompleted);
    case "active":
      return tasks.filter((task) => !task.isCompleted);
    default:
      return tasks;
  }
};

const getTaskById = (id) => tasks.find((task) => task.id === id);

const searchTasks = (list, query) => {
  const cleanQuery = query.trim().toLowerCase();
  return list.filter((task) => task.title.toLowerCase().includes(cleanQuery));
};

// мутация исходного масиива убрана 1
const sortTasks = (list) => {
  const sortedTasks = [...list];

  return sortedTasks.sort((a, b) => a.title.localeCompare(b.title, "ru"));
};

const sortTasksByStatus = (list) => {
  const sortedTasks = [...list];

  return sortedTasks.sort(
    (a, b) => Number(a.isCompleted) - Number(b.isCompleted),
  );
};
//сортировка по алфавиту по статусу и дефолт список
const getSortedTasks = (list, sort) => {
  switch (sort) {
    case "alphabetical":
      return sortTasks(list);
    case "status":
      return sortTasksByStatus(list);
    default:
      return list;
  }
};

const createTaskElement = (task) => {
  const li = document.createElement("li");
  li.dataset.id = task.id;
  li.className =
    "flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[#151215] p-4 transition hover:border-[var(--accent-color)]";

  li.innerHTML = `
    <label class="task-checkbox-label flex-1 min-w-0">
      <input type="checkbox" ${task.isCompleted ? "checked" : ""} />
      <span class="checkbox"></span>
      <span class="task-text"></span>
    </label>
    <button
      type="button"
      data-action="delete"
      class="ml-auto shrink-0 rounded-lg border border-[var(--border-color)] px-3 py-2 text-sm text-[#d76a78] transition hover:border-[var(--accent-color)] hover:bg-[#852637]/20 hover:text-white"
    >
      Удалить
    </button>
  `;

  const taskText = li.querySelector(".task-text");
  taskText.textContent = task.title;
  taskText.classList.toggle("line-through", task.isCompleted);
  taskText.classList.toggle("opacity-60", task.isCompleted);

  return li;
};
const getEmptyText = (visibleCount) => {
  if (visibleCount > 0) return "";
  if (tasks.length === 0) return "Список пуст";
  if (searchQuery.trim()) return "Ничего не найдено";
  return "В этой категории пусто";
};
const updateStats = () => {
  // деструктуризация обьекта
  const { total, completed, active } = getStats();
  headerTotal.textContent = total;
  statsTotal.textContent = total;
  statsCompleted.textContent = completed;
  statsActive.textContent = active;
};
const refreshChanges = () => {
  updateStats();
  renderTasks();
};
const renderTasks = () => {
  const byFilter = getTasksByFilter(currentFilter);
  const visibleTasks = searchTasks(byFilter, searchQuery); //фильтр и посик
  const sortedTasks = getSortedTasks(visibleTasks, currentSort);
  taskList.replaceChildren(...sortedTasks.map(createTaskElement));
  const emptyText = getEmptyText(visibleTasks.length);
  emptyMessage.textContent = emptyText;
  emptyMessage.hidden = !emptyText;
};

// события
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const result = createTask(taskInput.value);
  if (!result.success) {
    formError.textContent = result.error;
    formError.hidden = false;
    return;
  }

  formError.hidden = true;
  taskInput.value = "";
  refreshChanges();
});

// поиск по буквам без нажатия кнопки
// Поиск с debounce
searchInput.addEventListener("input", (event) => {
  clearTimeout(searchTimer);

  const query = event.target.value;

  searchTimer = setTimeout(() => {
    searchQuery = query;
    renderTasks();
  }, 300);
});
//сортировк
sortSelect.addEventListener("change", (event) => {
  currentSort = event.target.value;
  renderTasks();
});

// переключение фильтров (radio)
filtersBox.addEventListener("change", (event) => {
  if (!event.target.matches("input[name='filter']")) return;

  currentFilter = event.target.value;
  renderTasks();
});

// делегирование событий на кнопки удаления и чекбоксы
taskList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-action='delete']");
  if (!deleteButton) return;

  const id = Number(deleteButton.closest("li").dataset.id);
  const result = deleteTask(id);
  if (result.success) {
    refreshChanges();
  }
});

taskList.addEventListener("change", (event) => {
  if (!event.target.matches("input[type='checkbox']")) return;

  const id = Number(event.target.closest("li").dataset.id);
  const result = toggleTaskStatus(id);
  if (result.success) {
    refreshChanges();
  }
});

resetButton.addEventListener("click", () => {
  while (tasks.length > 0) {
    tasks.pop();
  }

  initialTasks.forEach((task) => {
    tasks.push({ ...task });
  });

  nextId = Math.max(...tasks.map((task) => task.id)) + 1;

  refreshChanges();
});

refreshChanges();
