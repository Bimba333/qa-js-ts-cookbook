import { expect, test } from "@playwright/test";

import { sandboxName, withSandboxClient } from "../support/sut/database.js";

test("откатывает изменения внутри границы транзакции", async () => {
  const table = sandboxName("tx_items");

  await withSandboxClient(async (client) => {
    await client.query(
      `CREATE TABLE ${table} (
         id text PRIMARY KEY,
         title text NOT NULL
       )`,
    );

    try {
      await client.query("BEGIN");
      try {
        await client.query(
          `INSERT INTO ${table} (id, title) VALUES ($1, $2)`,
          ["item-212", "Rollback item"],
        );

        // Нарушение уникальности первичного ключа.
        await expect(
          client.query(
            `INSERT INTO ${table} (id, title) VALUES ($1, $2)`,
            ["item-212", "Duplicate item"],
          ),
        ).rejects.toMatchObject({ code: "23505" });

        // После ошибки транзакция переходит в состояние aborted:
        // любой следующий запрос отклоняется до конца транзакции.
        await expect(client.query("SELECT 1")).rejects.toMatchObject({
          code: "25P02",
        });
      } finally {
        await client.query("ROLLBACK");
      }

      // Откат вернул состояние к началу транзакции: успешная вставка
      // тоже отменена, потому что границей владеет транзакция, а не запрос.
      const remaining = await client.query(
        `SELECT id FROM ${table} WHERE id = $1`,
        ["item-212"],
      );
      expect(remaining.rows).toEqual([]);
    } finally {
      await client.query(`DROP TABLE IF EXISTS ${table}`);
    }
  });
});
