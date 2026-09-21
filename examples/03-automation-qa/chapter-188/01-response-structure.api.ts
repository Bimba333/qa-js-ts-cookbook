import { expect, test } from "../support/sut/fixtures.js";
import { isWorkItem } from "../support/sut/types.js";

test("проверяет уровни HTTP-ответа", async ({ workItems }) => {
  const response = await workItems.create({
    title: "Запись для разбора ответа",
    description: "Ответ проверяется по трём уровням",
    priority: "LOW",
  });

  // Первый уровень — статус: создан новый ресурс.
  expect(response.status()).toBe(201);

  // Второй уровень — заголовки: тип содержимого и идентификатор запроса,
  // по которому ответ связывается с логом и audit trail стенда.
  const headers = response.headers();
  expect(headers["content-type"]).toContain("application/json");
  expect(headers["x-correlation-id"]).toMatch(/^[0-9a-f-]{36}$/);
  expect(headers["cache-control"]).toBe("no-store");

  // Третий уровень — тело: форма ресурса и значения, назначенные сервером.
  const body: unknown = await response.json();
  expect(isWorkItem(body)).toBe(true);
  if (!isWorkItem(body)) throw new Error("Ответ не соответствует контракту");

  expect(body.status).toBe("NEW");
  expect(body.version).toBe(1);
});
