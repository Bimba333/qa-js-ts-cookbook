import { expect, test } from "@playwright/test";

test("начинает ожидание popup до действия", async ({ page }) => {
  await page.setContent(`
    <button onclick="window.open('about:blank', '_blank')">
      Открыть отчёт
    </button>
  `);

  const popupPromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Открыть отчёт" }).click();
  const popup = await popupPromise;

  try {
    await popup.setContent("<h1>Отчёт</h1>");
    await expect(popup.getByRole("heading", { name: "Отчёт" })).toBeVisible();
    expect(page.context().pages()).toContain(popup);
  } finally {
    await popup.close();
  }
});
