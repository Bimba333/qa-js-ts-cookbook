import { expect, test } from "@playwright/test";

test("новый контекст не наследует состояние", async ({ browser }) => {
  const authenticatedContext = await browser.newContext();
  const guestContext = await browser.newContext();
  const storagePageUrl = new URL("./storage-page.html", import.meta.url).href;

  try {
    const authenticatedPage = await authenticatedContext.newPage();
    const guestPage = await guestContext.newPage();
    await authenticatedPage.goto(storagePageUrl);
    await guestPage.goto(storagePageUrl);

    await authenticatedPage.evaluate(() => sessionStorage.setItem("user", "qa-user"));

    await expect.poll(() => authenticatedPage.evaluate(() => sessionStorage.getItem("user"))).toBe("qa-user");
    await expect.poll(() => guestPage.evaluate(() => sessionStorage.getItem("user"))).toBeNull();
  } finally {
    await authenticatedContext.close();
    await guestContext.close();
  }
});
