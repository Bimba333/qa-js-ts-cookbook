import { expect, test } from "@playwright/test";
import { withIsolatedClient } from "../support/postgresql/postgresql-test-db.js";
import { TasksRepository } from "../support/postgresql/tasks-repository.js";

test("выражает операцию базы данных через узкий публичный API", async () => {
  await withIsolatedClient(async ({ client }) => {
    const tasks = new TasksRepository(client);
    await tasks.createTask({
      id: "task-210",
      title: "Repository boundary",
      priority: "high",
      estimatedHours: 2.5,
    });

    const task = await tasks.findTask("task-210");

    expect(task).toMatchObject({
      id: "task-210",
      estimatedHours: 2.5,
      description: null,
    });
  });
});
