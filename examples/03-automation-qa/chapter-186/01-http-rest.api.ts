import { expect, test } from "../support/sut/fixtures.js";

test("различает безопасный запрос и идемпотентную операцию", async ({
  workItems,
}) => {
  const created = await workItems.createOrThrow({
    title: "Проверить отчёт",
    description: "Запись для проверки идемпотентности",
    priority: "MEDIUM",
  });

  // GET безопасен: повторение не меняет состояние и возвращает тот же ресурс.
  const firstRead = await workItems.get(created.id);
  const secondRead = await workItems.get(created.id);

  expect(firstRead.status()).toBe(200);
  expect(secondRead.status()).toBe(200);
  expect(await secondRead.json()).toEqual(await firstRead.json());

  const firstDelete = await workItems.remove(created.id);
  const secondDelete = await workItems.remove(created.id);

  // DELETE идемпотентен по итоговому состоянию: ресурса нет после обоих
  // вызовов. Но одинаковое состояние не обязано давать одинаковый статус.
  expect(firstDelete.status()).toBe(204);
  expect(secondDelete.status()).toBe(404);
  expect((await workItems.get(created.id)).status()).toBe(404);
});
