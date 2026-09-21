import { withReaderClient } from "../support/sut/database.js";
import { expect, test } from "../support/sut/fixtures.js";

test("передаёт значения отдельно от текста SQL", async ({ workItems }) => {
  // Заголовок специально содержит кавычки и признаки инъекции.
  const dangerousTitle = "QA task'); DROP TABLE users; --";

  const created = await workItems.createOrThrow({
    title: dangerousTitle,
    description: "Значение не должно стать частью команды",
    priority: "LOW",
  });

  await withReaderClient(async (client) => {
    // Значение уезжает отдельным параметром: драйвер не подставляет его
    // в текст запроса, поэтому содержимое не может изменить команду.
    const found = await client.query<{ id: string; title: string }>(
      "SELECT id, title FROM work_items WHERE title = $1",
      [dangerousTitle],
    );

    expect(found.rows).toEqual([{ id: created.id, title: dangerousTitle }]);

    // Таблица, которую «пытались удалить», на месте.
    const users = await client.query<{ total: string }>(
      "SELECT count(*)::text AS total FROM users",
    );
    expect(Number(users.rows[0]?.total)).toBeGreaterThan(0);

    // Параметр остаётся значением и там, где он выглядит как часть условия.
    const byPattern = await client.query<{ total: string }>(
      "SELECT count(*)::text AS total FROM work_items WHERE title LIKE $1",
      ["%' OR '1'='1"],
    );
    expect(Number(byPattern.rows[0]?.total)).toBe(0);
  });
});
