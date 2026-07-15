import { expect, test } from "@playwright/test";

test.describe("жизненный цикл", () => {
  test.beforeEach(async ({ page }) => {
    await page.setContent(`
      <h1>Тестовая страница</h1>
      <ol aria-label="События"><li>beforeEach</li></ol>
    `);
  });
  test.afterEach(async ({ page }) => {
    await page.getByRole("list").evaluate((list) => {
      const item = document.createElement("li");
      item.textContent = "afterEach";
      list.append(item);
    });
    await expect(page.getByRole("listitem")).toHaveText(["beforeEach", "test", "afterEach"]);
  });

  test("выполняет сценарий между hooks", async ({ page }) => {
    await page.getByRole("list").evaluate((list) => {
      const item = document.createElement("li");
      item.textContent = "test";
      list.append(item);
    });
    await expect(page.getByRole("heading")).toHaveText("Тестовая страница");
    await expect(page.getByRole("listitem")).toHaveText(["beforeEach", "test"]);
  });
});
