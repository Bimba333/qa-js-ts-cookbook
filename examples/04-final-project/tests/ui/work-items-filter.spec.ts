import { expect, test } from "../../src/fixtures/ui-fixture.js";

/**
 * Сценарий 1: отбор списка действиями пользователя.
 *
 * Фильтр применяется через форму, а не переходом по адресу с параметрами:
 * иначе проверялся бы маршрут, а не поведение интерфейса.
 */
test("фильтр по статусу оставляет в списке только выбранные задачи", async ({
  uiPage,
  workItemsPage,
}) => {
  await workItemsPage.open();
  await expect(workItemsPage.heading()).toBeVisible();

  await workItemsPage.filter.selectStatus("DONE");
  await workItemsPage.filter.apply();
  await uiPage.waitForURL(/status=DONE/);

  const statuses = await workItemsPage.statusCells().allInnerTexts();

  expect(statuses.length).toBeGreaterThan(0);
  expect(statuses.every((value) => value.trim() === "DONE")).toBe(true);
});

test("состояние входа переиспользуется: форма входа не открывается", async ({
  uiPage,
  workItemsPage,
}) => {
  await workItemsPage.open();

  await expect(workItemsPage.heading()).toBeVisible();
  expect(uiPage.url()).not.toContain("/login");
});
