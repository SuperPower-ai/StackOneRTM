const KEY = "priority-list";

export function loadTasks() {
  const raw = localStorage.getItem(KEY);
  return JSON.parse(raw);
}

export function saveTasks(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}
