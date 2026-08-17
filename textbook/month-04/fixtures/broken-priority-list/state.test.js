import assert from "node:assert/strict";
import { test } from "node:test";
import { addTask, emptyList } from "./js/state.js";

test("addTask appends a task", () => {
  const list = emptyList();
  const next = addTask(list, { title: "Ship", priority: 1 });
  assert.equal(next.length, 1);
  assert.equal(next[0].title, "Ship");
});
