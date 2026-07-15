import { expect, test } from "@playwright/test";

test("ожидает наблюдаемое состояние", async ({ page }) => {
  await page.setContent(`
    <button onclick="setTimeout(() => document.getElementById('result').hidden = false, 80)">Сформировать</button>
    <p id="result" hidden>Отчет готов</p>
  `);

  await page.getByRole("button", { name: "Сформировать" }).click();
  await expect(page.getByText("Отчет готов")).toBeVisible();
});
