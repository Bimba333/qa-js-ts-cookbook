import { expect, test } from "@playwright/test";

import { sutConfig } from "../support/sut/config.js";
import { signIn } from "../support/sut/ui.js";

test("не переносит состояние сессии между контекстами", async ({ browser }) => {
  const authenticated = await browser.newContext();
  const fresh = await browser.newContext();

  try {
    const authenticatedPage = await authenticated.newPage();
    await signIn(authenticatedPage);

    // Второй контекст создан с чистого листа: у него нет ни cookie,
    // ни сессии первого, хотя браузер тот же самый.
    const freshPage = await fresh.newPage();
    await freshPage.goto(`${sutConfig().baseURL}/work-items`);

    await expect(freshPage).toHaveURL(/\/login$/);
    await expect(
      freshPage.getByRole("heading", { name: "Вход в систему" }),
    ).toBeVisible();

    // Первый контекст при этом остаётся аутентифицированным.
    await authenticatedPage.goto(`${sutConfig().baseURL}/work-items`);
    await expect(
      authenticatedPage.getByRole("heading", { name: "Задачи" }),
    ).toBeVisible();

    expect(
      (await fresh.cookies(sutConfig().baseURL)).some(
        (cookie) => cookie.name === "sut_session",
      ),
    ).toBe(false);
  } finally {
    await authenticated.close();
    await fresh.close();
  }
});
