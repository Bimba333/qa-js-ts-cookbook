import { expect, test } from "@playwright/test";
import { withIsolatedClient } from "../support/postgresql/postgresql-test-db.js";

test("передаёт значения отдельно от текста SQL", async () => {
  await withIsolatedClient(async ({ client }) => {
    const title = "QA task'); DROP TABLE owners; --";
    const insert = await client.query<{ id: string; description: string | null }>(
      `INSERT INTO tasks (id, title, priority, description)
      VALUES ($1, $2, $3, $4)
      RETURNING id, description`,
      ["task-209", title, "low", null],
    );

    expect(insert.rowCount).toBe(1);
    expect(insert.rows[0]).toEqual({ id: "task-209", description: null });

    const stored = await client.query<{ title: string }>(
      "SELECT title FROM tasks WHERE id = $1",
      ["task-209"],
    );
    expect(stored.rows).toEqual([{ title }]);
  });
});
