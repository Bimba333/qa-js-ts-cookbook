import { expect, test } from "../support/sut/fixtures.js";
import { isWorkItem } from "../support/sut/types.js";

test("разделяет HTTP-контракт и бизнес-результат", async ({ workItems }) => {
  const response = await workItems.create({
    title: "Критический отчёт",
    description: "Запись для проверки бизнес-правил",
    priority: "HIGH",
  });

  // HTTP-контракт: транспорт отработал так, как обещано.
  expect(response.status(), "ресурс должен быть создан").toBe(201);

  const body: unknown = await response.json();
  if (!isWorkItem(body)) {
    throw new Error("Ответ создания не соответствует обязательной форме");
  }

  // Бизнес-результат: сервер сам назначил начальный статус и версию,
  // а переданные значения сохранил без изменения.
  expect(body.title, "API должен сохранить название без изменения").toBe(
    "Критический отчёт",
  );
  expect(body.priority).toBe("HIGH");
  expect(body.status, "новая запись начинает жизненный цикл в NEW").toBe("NEW");
  expect(body.version, "первая версия записи равна единице").toBe(1);

  // Состояние действительно сохранено, а не только отражено в ответе.
  const stored = await workItems.get(body.id);
  expect(stored.status()).toBe(200);
  expect(await stored.json()).toMatchObject({
    id: body.id,
    title: "Критический отчёт",
    status: "NEW",
    version: 1,
  });
});
