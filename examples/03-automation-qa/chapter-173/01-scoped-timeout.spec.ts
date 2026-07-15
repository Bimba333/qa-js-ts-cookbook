import { expect, test } from "@playwright/test";

test("задает локальную границу проверки", async ({ page }) => {
  await page.setContent(`
    <p aria-label="Статус">Запуск</p>
    <script>setTimeout(() => document.querySelector('p').textContent = 'Завершено', 80)</script>
  `);

  await expect(page.getByLabel("Статус")).toHaveText("Завершено", { timeout: 500 });
});
