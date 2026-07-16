import { expect, test } from "@playwright/test";

test("прикладывает ограниченный screenshot видимого UI", async ({ page }, testInfo) => {
  await page.setContent('<main><h1>Task task-227</h1><p role="status">ready</p></main>');
  await expect(page.getByRole("status")).toHaveText("ready");

  const screenshot = await page.screenshot();
  await testInfo.attach("task-227-visible-state", {
    body: screenshot,
    contentType: "image/png",
  });

  expect(screenshot.byteLength).toBeGreaterThan(0);
});
