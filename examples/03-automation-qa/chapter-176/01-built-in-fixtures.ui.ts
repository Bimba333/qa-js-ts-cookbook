import { expect, test } from "@playwright/test";

test("предоставляет связанные browser resources", async ({ browser, context, page }) => {
  await page.setContent('<main><h1>Профиль QA</h1></main>');

  expect(page.context()).toBe(context);
  expect(context.browser()).toBe(browser);
  await expect(page.getByRole("heading", { name: "Профиль QA" })).toBeVisible();
});
