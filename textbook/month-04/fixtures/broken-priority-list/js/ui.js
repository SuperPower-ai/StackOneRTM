export function renderList(ul, list) {
  ul.innerHTML = "";
  for (const item of list) {
    const li = document.createElement("li");
    li.dataset.id = item.id;
    const title = document.createElement("span");
    title.innerHTML = item.title;
    const mark = document.createElement("button");
    mark.type = "button";
    mark.className = "toggle-done";
    mark.textContent = item.done ? "Undo" : "Done";
    li.append(title, mark);
    ul.append(li);
  }
}

export const stats = {
  list: [],
  count() {
    return this.list.filter((item) => !item.done).length;
  },
};
