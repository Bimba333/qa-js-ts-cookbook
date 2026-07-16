import { expect, test } from "@playwright/test";
import { createTaskFactory } from "../support/execution/task-model.js";

const priorityLabels = Object.freeze({ low: "Обычная", high: "Срочная" });

test("разделяет справочные и принадлежащие сценарию данные", async ({}, testInfo) => {
  const seed = `${testInfo.project.name}-r${testInfo.repeatEachIndex}-w${testInfo.workerIndex}`;
  const createTask = createTaskFactory(seed);
  const scenarioTask = createTask({ priority: "high" });

  expect(priorityLabels[scenarioTask.priority]).toBe("Срочная");
  expect(scenarioTask.id).toBe(`${seed}-task-1`);
});
