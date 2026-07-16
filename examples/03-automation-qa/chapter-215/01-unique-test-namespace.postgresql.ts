import { expect, test } from "@playwright/test";
import { withIsolatedClient } from "../support/postgresql/postgresql-test-db.js";
import { TasksRepository } from "../support/postgresql/tasks-repository.js";

test("разделяет данные сценариев через уникальное пространство имён", async () => {
  const runWorkerScenario = async (): Promise<string> => withIsolatedClient(
    async ({ client, schema }) => {
      const tasks = new TasksRepository(client);
      await tasks.createTask({
        id: "shared-logical-task",
        title: "Same logical title",
        priority: "low",
      });

      expect((await tasks.listTasks()).map((task) => task.id)).toEqual([
        "shared-logical-task",
      ]);
      return schema;
    },
  );

  const schemas = await Promise.all([runWorkerScenario(), runWorkerScenario()]);
  expect(new Set(schemas).size).toBe(2);

  await withIsolatedClient(async ({ client }) => {
    const leakedSchemas = await client.query<{ schema_name: string }>(
      `SELECT nspname AS schema_name
      FROM pg_namespace
      WHERE nspname = ANY($1::text[])
      ORDER BY nspname`,
      [schemas],
    );
    expect(leakedSchemas.rows).toEqual([]);

    const tasks = new TasksRepository(client);
    expect(await tasks.listTasks()).toEqual([]);
  });
});
