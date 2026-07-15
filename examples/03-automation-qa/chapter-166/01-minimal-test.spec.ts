import { expect, test } from "@playwright/test";

test("показывает статус заказа", async ({ page }) => {
  await page.setContent("<main><h1>Заказ принят</h1></main>");

  await expect(page.getByRole("heading", { name: "Заказ принят" })).toBeVisible();
});
