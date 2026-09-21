import { expect, test } from "@playwright/test";

import { sandboxName, withSandboxClient } from "../support/sut/database.js";

test("очищает принадлежащие тесту данные в порядке зависимостей", async () => {
  const owners = sandboxName("owners");
  const items = sandboxName("items");

  await withSandboxClient(async (client) => {
    // Учебная песочница: здесь тест владеет своими таблицами. Доменные
    // таблицы стенда остаются доступны только для чтения.
    await client.query(
      `CREATE TABLE ${owners} (
         id text PRIMARY KEY,
         name text NOT NULL
       )`,
    );
    await client.query(
      `CREATE TABLE ${items} (
         id text PRIMARY KEY,
         title text NOT NULL,
         owner_id text NOT NULL REFERENCES ${owners}(id)
       )`,
    );

    try {
      await client.query(
        `INSERT INTO ${owners} (id, name) VALUES ($1, $2)`,
        ["owner-211", "QA Engineer"],
      );
      await client.query(
        `INSERT INTO ${items} (id, title, owner_id) VALUES ($1, $2, $3)`,
        ["item-211", "Owned test data", "owner-211"],
      );

      // Удаление владельца раньше зависимой записи нарушает foreign key.
      await expect(
        client.query(`DELETE FROM ${owners} WHERE id = $1`, ["owner-211"]),
      ).rejects.toMatchObject({ code: "23503" });

      // Правильный порядок: сначала зависимые данные, потом владелец.
      const firstDelete = await client.query(
        `DELETE FROM ${items} WHERE id = $1`,
        ["item-211"],
      );
      const repeatedDelete = await client.query(
        `DELETE FROM ${items} WHERE id = $1`,
        ["item-211"],
      );

      expect(firstDelete.rowCount).toBe(1);
      // Повторная очистка безопасна: удалять нечего, ошибки нет.
      expect(repeatedDelete.rowCount).toBe(0);

      const ownerDelete = await client.query(
        `DELETE FROM ${owners} WHERE id = $1`,
        ["owner-211"],
      );
      expect(ownerDelete.rowCount).toBe(1);
    } finally {
      // Таблицы удаляются в обратном порядке зависимостей.
      await client.query(`DROP TABLE IF EXISTS ${items}`);
      await client.query(`DROP TABLE IF EXISTS ${owners}`);
    }
  });
});
