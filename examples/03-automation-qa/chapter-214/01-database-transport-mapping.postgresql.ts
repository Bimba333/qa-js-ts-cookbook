import { expect, test } from "@playwright/test";
import { withIsolatedClient } from "../support/postgresql/postgresql-test-db.js";
import { TasksRepository } from "../support/postgresql/tasks-repository.js";

test("нормализует строку базы данных перед сравнением с транспортной моделью", async () => {
  await withIsolatedClient(async ({ client }) => {
    const tasks = new TasksRepository(client);
    const stored = await tasks.createTask({
      id: "task-214",
      title: "Cross-layer model",
      priority: "high",
      estimatedHours: 3.75,
    });
    const transportModel = {
      id: "task-214",
      title: "Cross-layer model",
      priority: "high",
      estimatedHours: 3.75,
      description: null,
    };

    const rawTimestamp = await client.query<{ created_at: Date }>(
      "SELECT created_at FROM tasks WHERE id = $1",
      ["task-214"],
    );
    const createdAt = rawTimestamp.rows[0]?.created_at;
    if (createdAt === undefined) {
      throw new Error("Persisted task timestamp was not found");
    }

    expect(stored).toMatchObject(transportModel);
    expect(stored.createdAt).toBe(createdAt.toISOString());
  });
});
