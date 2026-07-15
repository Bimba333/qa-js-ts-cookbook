import { expect, test } from "@playwright/test";

test("заполняет настройки отчета", async ({ page }) => {
  await page.setContent(`
    <label>Название <input aria-label="Название"></label>
    <label><input type="checkbox" aria-label="Добавить скриншоты"> Скриншоты</label>
    <label>Формат <select aria-label="Формат"><option>HTML</option><option>JSON</option></select></label>
    <button onclick="document.getElementById('result').textContent = 'Настройки сохранены'">Сохранить</button>
    <p id="result"></p>
  `);

  await page.getByLabel("Название").fill("Регрессия");
  await page.getByLabel("Добавить скриншоты").check();
  await page.getByLabel("Формат").selectOption("JSON");
  await page.getByRole("button", { name: "Сохранить" }).click();

  await expect(page.getByText("Настройки сохранены")).toBeVisible();
});
