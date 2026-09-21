import { expect, test } from "../support/sut/fixtures.js";
import { isApiError, isWorkItem } from "../support/sut/types.js";

test("проверяет внешний JSON во время выполнения", async ({ workItems }) => {
  const created = await workItems.createOrThrow({
    title: "Запись для проверки контракта",
    description: "Ответ проверяется guard-функцией",
    priority: "LOW",
  });

  const success: unknown = await (await workItems.get(created.id)).json();

  expect(isWorkItem(success), "успешный ответ обязан пройти guard").toBe(true);
  expect(isApiError(success), "успешный ответ не является ошибкой").toBe(false);

  // Ответ с ошибкой имеет другую форму. Тип в TypeScript исчезает после
  // компиляции, поэтому отличить их может только проверка во время выполнения.
  const absentId = "00000000-0000-4000-8000-000000000000";
  const failure: unknown = await (await workItems.get(absentId)).json();

  expect(isWorkItem(failure), "ответ с ошибкой не должен пройти guard").toBe(
    false,
  );
  expect(isApiError(failure)).toBe(true);
  if (!isApiError(failure)) throw new Error("Ожидался контракт ошибки");

  expect(failure.correlationId).toMatch(/^[0-9a-f-]{36}$/);
});
