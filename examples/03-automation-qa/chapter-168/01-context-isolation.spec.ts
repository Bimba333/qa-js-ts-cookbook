import { expect, test } from "@playwright/test";

test("контексты не разделяют localStorage", async ({ browser }) => {
  const firstContext = await browser.newContext();
  const secondContext = await browser.newContext();
  const storagePageUrl = new URL("./storage-page.html", import.meta.url).href;

  try {
    const firstPage = await firstContext.newPage();
    const secondPage = await secondContext.newPage();
    await firstPage.goto(storagePageUrl);
    await secondPage.goto(storagePageUrl);

    await firstPage.evaluate(() => localStorage.setItem("role", "admin"));

    await expect.poll(() => firstPage.evaluate(() => localStorage.getItem("role"))).toBe("admin");
    await expect.poll(() => secondPage.evaluate(() => localStorage.getItem("role"))).toBeNull();
  } finally {
    await firstContext.close();
    await secondContext.close();
  }
});
