import { expect, type Locator, test as base } from "@playwright/test";

type TestFixtures = {
  orderId: string;
  orderHeading: Locator;
};

const test = base.extend<TestFixtures>({
  orderId: async ({}, use) => {
    const orderId = "order-qa-177";
    await use(orderId);
  },
  orderHeading: async ({ page, orderId }, use) => {
    await page.setContent(`<main><h1>Заказ ${orderId}</h1></main>`);
    await use(page.getByRole("heading", { name: `Заказ ${orderId}` }));
  },
});

test("разрешает fixture dependencies до запуска теста", async ({ orderHeading }) => {
  await expect(orderHeading).toBeVisible();
});
