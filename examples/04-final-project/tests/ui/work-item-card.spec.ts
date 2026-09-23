import { expect, test } from "../../src/fixtures/ui-fixture.js";

/**
 * Сценарий 2: переход из списка в карточку.
 *
 * Проверяется связь между экранами: заголовок карточки принадлежит той же
 * записи, которую читатель выбрал в списке.
 */
test("переход из списка открывает карточку выбранной задачи", async ({
  workItemsPage,
  workItemCardPage,
}) => {
  await workItemsPage.open();

  const titleInList = (await workItemsPage.firstLink().innerText()).trim();

  await workItemsPage.openFirst();

  await expect(workItemCardPage.heading()).toContainText(titleInList);
  expect(workItemCardPage.identifier().length).toBeGreaterThan(0);
});

/**
 * Управляемое падение: доказательства сохраняются.
 *
 * Тест не падает сам — он выполняет заведомо неуспешную проверку в
 * контролируемых условиях и убеждается, что диагностика доступна. Так у
 * набора остаётся зелёный итог, а поведение при падении всё равно проверено.
 */
test("несошедшаяся проверка объясняет причину и оставляет снимок", async ({
  uiPage,
  workItemsPage,
}, testInfo) => {
  await workItemsPage.open();

  const missing = uiPage.getByRole("heading", { name: "Такого заголовка нет" });

  let message = "";

  try {
    await expect(missing).toBeVisible({ timeout: 700 });
  } catch (error) {
    message = error instanceof Error ? error.message : String(error);
  }

  expect(message).toContain("Timeout");

  const screenshot = await uiPage.screenshot();

  await testInfo.attach("состояние на момент несовпадения", {
    body: screenshot,
    contentType: "image/png",
  });

  expect(screenshot.byteLength).toBeGreaterThan(1000);
});
