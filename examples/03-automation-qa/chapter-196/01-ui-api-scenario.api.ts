import { expect, test } from "../support/sut/fixtures.js";
import { sutConfig } from "../support/sut/config.js";
import { signIn } from "../support/sut/ui.js";

test("проверяет UI-действие через API и очищает данные", async ({
  page,
  workItems,
}) => {
  const title = `Создано из UI ${test.info().testId}`;

  await signIn(page);
  await page.goto(`${sutConfig().baseURL}/work-items/new`);
  await page.getByLabel("Заголовок").fill(title);
  await page.getByLabel("Описание").fill("Запись создана через форму");
  await page.getByLabel("Приоритет").selectOption("HIGH");
  await page.getByRole("button", { name: "Создать задачу" }).click();

  // UI показывает результат, но источником истины остаётся состояние
  // на сервере: идентификатор берётся со страницы, проверка идёт через API.
  const createdId = await page.getByTestId("work-item-id").textContent();
  expect(createdId).toBeTruthy();
  if (createdId === null) throw new Error("Страница не показала идентификатор");

  const response = await workItems.get(createdId);
  expect(response.status()).toBe(200);
  expect(await response.json()).toMatchObject({
    title,
    priority: "HIGH",
    status: "NEW",
    version: 1,
  });

  // Запись принадлежит запуску UI-сессии, а не токена этого теста,
  // поэтому очистка по текущему запуску её не удалит — удаляем явно.
  expect((await workItems.remove(createdId)).status()).toBe(204);
});
