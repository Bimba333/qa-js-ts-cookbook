import { expect, test } from "@playwright/test";
import { withIsolatedClient } from "../support/postgresql/postgresql-test-db.js";
import { TasksRepository } from "../support/postgresql/tasks-repository.js";

test("очищает принадлежащие тесту данные в порядке зависимостей", async () => {
  await withIsolatedClient(async ({ client }) => {
    const tasks = new TasksRepository(client);
    await tasks.createOwner("owner-211", "QA Engineer");
    await tasks.createTask({
      id: "task-211",
      title: "Owned test data",
      priority: "low",
      ownerId: "owner-211",
    });

    expect(await tasks.deleteTask("task-211")).toBe(1);
    expect(await tasks.deleteTask("task-211")).toBe(0);

    const ownerDelete = await client.query(
      "DELETE FROM owners WHERE id = $1",
      ["owner-211"],
    );
    expect(ownerDelete.rowCount).toBe(1);
  });

  let failedSchema: string | undefined;
  await expect(withIsolatedClient(async ({ schema }) => {
    failedSchema = schema;
    throw new Error("controlled scenario failure");
  })).rejects.toThrow("controlled scenario failure");

  await withIsolatedClient(async ({ client }) => {
    const leakedSchema = await client.query<{ schema_name: string }>(
      "SELECT nspname AS schema_name FROM pg_namespace WHERE nspname = $1",
      [failedSchema],
    );
    expect(leakedSchema.rows).toEqual([]);
  });
});
