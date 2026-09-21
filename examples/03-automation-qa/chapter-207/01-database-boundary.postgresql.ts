import { findWorkItemRow, withReaderClient } from "../support/sut/database.js";
import { expect, test } from "../support/sut/fixtures.js";

test("проверяет конкретный факт в PostgreSQL", async ({ workItems }) => {
  // Действие выполняется через публичную границу: тест не пишет в базу сам.
  const created = await workItems.createOrThrow({
    title: "Database boundary",
    description: "Проверка сохранённого состояния",
    priority: "HIGH",
  });

  // База отвечает на вопрос, на который не отвечает HTTP-ответ:
  // что именно сохранено на стороне системы.
  await withReaderClient(async (client) => {
    const row = await findWorkItemRow(client, created.id);

    expect(row).toBeDefined();
    expect(row?.title).toBe("Database boundary");
    expect(row?.priority).toBe("HIGH");
    expect(row?.status).toBe("NEW");

    // Признак seed отличает учебные данные от созданных тестом.
    expect(row?.is_seed).toBe(false);
  });
});
