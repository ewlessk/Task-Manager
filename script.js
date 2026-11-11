const tasks = [
  {
    id: 1,
    title: "Прогуляться",
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Разобрать письма",
    isCompleted: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Потренить",
    isCompleted: true,
    createdAt: new Date().toISOString(),
  },
  //еще пару задач
];

const generateId = () => Date.now();

const createTask = (title) => {
  const cleanTitle = title.trim();
  if (!cleanTitle) {
    return { success: false, error: "Название не может быть пустым" };
  }

  const newTask = {
    id: generateId(),
    title: cleanTitle,
    isCompleted: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
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
//дописать сортировку через list нужна ли копия массива??????????
