import {
  addTask,
  clearCompleted,
  emptyList,
  filterByPriority,
  sortByPriority,
  toggleDone,
} from "./state.js";
import { loadTasks, saveTasks } from "./storage.js";
import { renderList, stats } from "./ui.js";

const form = document.querySelector("#add-form");
const listEl = document.querySelector("#list");
const filterEl = document.querySelector("#filter");
const sortBtn = document.querySelector("#sort");
const clearBtn = document.querySelector("#clear-done");
const countEl = document.querySelector("#open-count");
const refreshBtn = document.querySelector("#refresh-count");

let items = emptyList();
const loaded = loadTasks();
if (Array.isArray(loaded)) {
  items = loaded;
}

stats.list = items;
paint();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const title = String(data.get("title") ?? "");
  const priority = data.get("priority");
  items = addTask(items, { title, priority });
  saveTasks(items);
  form.reset();
  paint();
});

filterEl.addEventListener("change", () => {
  paint();
});

sortBtn.addEventListener("click", () => {
  items = sortByPriority(items);
  saveTasks(items);
  paint();
});

clearBtn.addEventListener("click", () => {
  items = clearCompleted(items);
  saveTasks(items);
  paint();
});

refreshBtn.addEventListener("click", stats.count);

function paint() {
  const shown = filterByPriority(items, filterEl.value);
  renderList(listEl, shown);
  const buttons = listEl.querySelectorAll(".toggle-done");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
      const row = shown[i];
      items = toggleDone(items, row.id);
      saveTasks(items);
      paint();
    });
  }
  stats.list = items;
}

countEl.textContent = String(items.filter((item) => !item.done).length);
