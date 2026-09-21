import { expect, test } from "@playwright/test";

import { sutConfig, SUT_USERS } from "../support/sut/config.js";

test("получает подготовленное состояние без повторного входа", async ({
  page,
}) => {
  // Тест не проходит форму входа: состояние подготовлено отдельным проектом
  // и подключено через storageState.
  await page.goto(`${sutConfig().baseURL}/work-items`);

  await expect(page.getByRole("heading", { name: "Задачи" })).toBeVisible();
  await expect(page.getByTestId("current-user")).toContainText(
    SUT_USERS.tester.login,
  );
});

test("хранит сессию в cookie, недоступной скриптам", async ({ context }) => {
  const cookies = await context.cookies(sutConfig().baseURL);
  const session = cookies.find((cookie) => cookie.name === "sut_session");

  expect(session).toBeDefined();
  // HttpOnly означает, что сессию нельзя прочитать из JavaScript страницы.
  expect(session?.httpOnly).toBe(true);
  expect(session?.sameSite).toBe("Lax");
});
