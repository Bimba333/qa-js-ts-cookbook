import { expect, test } from "@playwright/test";
import { createTaskFactory } from "../support/execution/task-model.js";

test("создаёт валидные данные с точечными overrides", async ({}, testInfo) => {
  const seed = `${testInfo.project.name}-r${testInfo.repeatEachIndex}-w${testInfo.workerIndex}`;
  const createTask = createTaskFactory(seed);
  const overrides = { title: "Проверить платеж", priority: "high" as const };
  const defaultTask = createTask();
  const urgentTask = createTask(overrides);

  expect(defaultTask).toEqual({
    id: `${seed}-task-1`,
    title: "Проверить отчёт",
    priority: "low",
    description: null,
  });
  expect(urgentTask.id).toBe(`${seed}-task-2`);
  expect(urgentTask.priority).toBe("high");
  expect(urgentTask).not.toBe(defaultTask);
  expect(overrides).toEqual({ title: "Проверить платеж", priority: "high" });
});
