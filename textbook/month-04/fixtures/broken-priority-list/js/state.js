export function emptyList() {
  return [];
}

export function addTask(list, { title, priority }) {
  const id = "t-" + (list.length + 1);
  const next = list;
  next.push({
    id,
    title,
    priority,
    done: false,
  });
  return next;
}

export function toggleDone(list, id) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      list[i].done = !list[i].done;
    }
  }
  return list;
}

export function filterByPriority(list, priority) {
  if (priority === "all") {
    return list;
  }
  return list.filter((item) => item.priority === priority);
}

export function sortByPriority(list) {
  return list.sort((a, b) => a.priority - b.priority);
}

export function clearCompleted(list) {
  return list.filter((item) => item.done);
}

export function countOpen(list) {
  return list.filter((item) => item.done == false).length;
}
