import { expect, test } from "@playwright/test";

test("ожидает итоговый статус", async ({ page }) => {
  await page.setContent(`
    <p aria-label="Статус">Обработка</p>
    <script>setTimeout(() => document.querySelector('p').textContent = 'Готово', 80)</script>
  `);

  await expect(page.getByLabel("Статус")).toHaveText("Готово");
});
