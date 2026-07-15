import { expect, test } from "@playwright/test";

test("находит заказ по пользовательскому смыслу", async ({ page }) => {
  await page.setContent(`
    <ul aria-label="Заказы">
      <li><span>order-41</span><button>Открыть</button></li>
      <li><span>order-42</span><button>Открыть</button></li>
    </ul>
  `);

  const order = page.getByRole("listitem").filter({ hasText: "order-42" });

  await expect(order).toHaveCount(1);
  await expect(order.getByRole("button", { name: "Открыть" })).toBeVisible();
});
