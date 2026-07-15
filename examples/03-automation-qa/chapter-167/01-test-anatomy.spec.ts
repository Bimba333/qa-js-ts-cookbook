import { expect, test } from "@playwright/test";

test.describe("создание заказа", () => {
  test("подтверждает отправку формы", async ({ page }) => {
    await page.setContent(`
      <label>Номер заказа <input aria-label="Номер заказа"></label>
      <button onclick="document.getElementById('status').textContent = 'Заказ создан'">Создать</button>
      <p id="status"></p>
    `);

    await page.getByLabel("Номер заказа").fill("order-42");
    await page.getByRole("button", { name: "Создать" }).click();

    await expect(page.getByText("Заказ создан")).toBeVisible();
  });
});
