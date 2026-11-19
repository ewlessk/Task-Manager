const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const formError = document.getElementById("form-error");

const taskList = document.getElementById("task-list");
const taskTemplate = document.getElementById("task-template");
const taskTemplateCompleted = document.getElementById(
  "task-template-completed",
);

const emptyMessage = document.getElementById("empty-message");
const headerTotal = document.getElementById("header-total");
const statsTotal = document.getElementById("stats-total");
const statsCompleted = document.getElementById("stats-completed");
const statsActive = document.getElementById("stats-active");
const resetButton = document.getElementById("reset-button");

console.log("Форма:", taskForm);
console.log("Поле ввода:", taskInput);
console.log("Список задач:", taskList);
console.log("Шаблоны:", taskTemplate, taskTemplateCompleted);
console.log("Статистика:", statsTotal, statsCompleted, statsActive);
console.log("Кнопка сброса:", resetButton);
const tasks = [
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
console.log("массив в начале :", tasks);
console.log("задачи:", tasks.length);

const generateId = () => Date.now();

const createTask = (title) => {
  const cleanTitle = title.trim();
  if (!cleanTitle) {
    return { success: false, error: "Название не может быть пустым" };
  }

  const newTask = {
    id: tasks.length + 1,
    title: cleanTitle,
    isCompleted: false,
    date: new Date(),
  };

  tasks.unshift(newTask);
  return { success: true, task: newTask };
};
const deleteTask = (id) => {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    return { success: false, error: "задача не найдена" };
  }
  tasks.splice(index, 1);
  return { success: true };
};
const toggleTaskStatus = (id) => {
  const task = tasks.find((item) => item.id === id);
  if (!task) {
    return { success: false, error: "нет задачи такой" };
  }
  task.isCompleted = !task.isCompleted;
  return { success: true, task };
};
const getStats = () => {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.isCompleted).length;
  const active = total - completed;
  return { total, completed, active };
};
const getTasksByFilter = (filter) => {
  switch (filter) {
    case "completed":
      return tasks.filter((task) => task.isCompleted);
    case "active":
      return tasks.filter((task) => !task.isCompleted);
    case "all":
    default:
      return tasks;
  }
};
const getTaskById = (id) => {
  const task = tasks.find((item) => item.id === id);
  if (!task) {
    return { success: false, error: "задача не найдена" };
  }
  return { success: true, task };
};
const searchTasks = (query) => {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) {
    return { success: false, error: "Запрос не может быть пустым" };
  }

  const results = tasks.filter((task) =>
    task.title.toLowerCase().includes(cleanQuery),
  );

  return { success: true, results };
};
const sortTasks = (tasksArray) => {
  const tasksCopy = tasksArray;

  tasksCopy.sort((a, b) => {
    return a.title.localeCompare(b.title);
  });

  return tasksCopy;
};
const sortTasksByStatus = (tasksArray) => {
  const tasksCopy = tasksArray;
  tasksCopy.sort((a, b) => {
    return Number(a.isCompleted) - Number(b.isCompleted);
  });
  return tasksCopy;
};
function createNewTask(tasksArray, newTask) {
  tasks.unshift(newTask);
  return tasksArray;
}
const renderTasks = () => {
  const renderedTasks = taskList.querySelectorAll(
    "li:not(#task-template):not(#task-template-completed)",
  );

  renderedTasks.forEach((element) => {
    element.remove();
  });

  tasks.forEach((task) => {
    const taskElement = task.isCompleted
      ? taskTemplateCompleted.cloneNode(true)
      : taskTemplate.cloneNode(true);
    taskElement.removeAttribute("hidden");
    const taskText = taskElement.querySelector(".task-text");
    taskText.textContent = task.title;

    taskList.appendChild(taskElement);
  });
};
renderTasks();
