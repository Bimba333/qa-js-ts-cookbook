import { expect, test } from "@playwright/test";
import { withIsolatedClient } from "../support/postgresql/postgresql-test-db.js";

test("проверяет конкретный факт в PostgreSQL", async () => {
  await withIsolatedClient(async ({ client }) => {
    await client.query(
      "INSERT INTO tasks (id, title, priority) VALUES ($1, $2, $3)",
      ["task-207", "Database boundary", "high"],
    );

    const result = await client.query<{ id: string; title: string }>(
      "SELECT id, title FROM tasks WHERE id = $1",
      ["task-207"],
    );

    expect(result.rows).toEqual([{ id: "task-207", title: "Database boundary" }]);
  });
});

