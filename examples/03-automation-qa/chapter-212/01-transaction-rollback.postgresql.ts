import { expect, test } from "@playwright/test";
import { withIsolatedClient } from "../support/postgresql/postgresql-test-db.js";

test("откатывает изменения внутри границы транзакции", async () => {
  await withIsolatedClient(async ({ client }) => {
    await client.query("BEGIN");
    try {
      await client.query(
        "INSERT INTO tasks (id, title, priority) VALUES ($1, $2, $3)",
        ["task-212", "Rollback task", "high"],
      );
      let constraintErrorCode: unknown;
      try {
        await client.query(
          "INSERT INTO tasks (id, title, priority) VALUES ($1, $2, $3)",
          ["task-212", "Duplicate task", "low"],
        );
      } catch (error) {
        constraintErrorCode = error instanceof Error && "code" in error
          ? error.code
          : undefined;
      }

      expect(constraintErrorCode).toBe("23505");
      await expect(client.query("SELECT 1")).rejects.toMatchObject({ code: "25P02" });
    } finally {
      await client.query("ROLLBACK");
    }

    const result = await client.query(
      "SELECT id FROM tasks WHERE id = $1",
      ["task-212"],
    );
    expect(result.rows).toEqual([]);
  });
});
