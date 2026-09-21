import { sutConfig } from "../support/sut/config.js";
import { expect, test } from "../support/sut/fixtures.js";

test("проверяет контролируемый отказ без побочного эффекта", async ({
  request,
  workItems,
}) => {
  const before = await workItems.listOrThrow({ limit: 1 });

  // Нарушение правила предметной области: пустой заголовок.
  const invalidTitle = await workItems.create({
    title: "   ",
    description: "Описание корректно",
    priority: "LOW",
  });

  // Превышение лимита тела запроса.
  const oversized = await workItems.create({
    title: "x".repeat(70 * 1024),
    description: "Слишком большое тело",
    priority: "LOW",
  });

  // Метод не поддерживается для коллекции: PATCH определён только
  // для конкретного ресурса.
  const unsupportedMethod = await request.patch(
    `${sutConfig().apiBaseURL}/work-items`,
    { headers: workItems.headers, data: {} },
  );

  expect(invalidTitle.status()).toBe(400);
  expect(await invalidTitle.json()).toMatchObject({
    code: "VALIDATION_FAILED",
    field: "title",
  });

  expect(oversized.status()).toBe(413);
  expect(await oversized.json()).toMatchObject({ code: "PAYLOAD_TOO_LARGE" });

  expect(unsupportedMethod.status()).toBe(405);
  expect(unsupportedMethod.headers()["allow"]).toBe("GET, POST");

  // Ни один отказ не изменил состояние: количество записей прежнее.
  const after = await workItems.listOrThrow({ limit: 1 });
  expect(after.total).toBe(before.total);
});

test("устаревшая версия отклоняется и не меняет запись", async ({
  workItems,
}) => {
  const created = await workItems.createOrThrow({
    title: "Запись для конфликта версий",
    description: "Проверка оптимистичной блокировки",
    priority: "MEDIUM",
  });

  const updated = await workItems.patch(created.id, {
    title: "Новое название",
    expectedVersion: created.version,
  });
  expect(updated.status()).toBe(200);

  // Второй запрос приходит с той же ожидаемой версией, что и первый.
  const stale = await workItems.patch(created.id, {
    title: "Название из устаревшего состояния",
    expectedVersion: created.version,
  });

  expect(stale.status()).toBe(409);
  expect(await stale.json()).toMatchObject({
    code: "VERSION_CONFLICT",
    field: "expectedVersion",
  });

  // Отказ не откатил и не применил изменение: запись осталась после первого.
  expect(await (await workItems.get(created.id)).json()).toMatchObject({
    title: "Новое название",
    version: created.version + 1,
  });
});
