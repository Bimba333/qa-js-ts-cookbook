import { expect, type Locator, type Page, test } from "@playwright/test";

import { sutConfig, SUT_USERS } from "../support/sut/config.js";

/**
 * Page Object знает, как выполнить действие на конкретной странице.
 *
 * Locators принадлежат объекту и остаются ленивыми: они разрешаются в момент
 * действия, а не при создании объекта.
 */
class LoginPage {
  readonly heading: Locator;
  readonly loginInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly error: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole("heading", { name: "Вход в систему" });
    this.loginInput = page.getByLabel("Логин");
    this.passwordInput = page.getByLabel("Пароль");
    this.submitButton = page.getByRole("button", { name: "Войти" });
    this.error = page.getByRole("alert");
  }

  async open(): Promise<void> {
    await this.page.goto(`${sutConfig().baseURL}/login`);
  }

  /** Публичный метод выражает действие пользователя, а не последовательность кликов. */
  async signInAs(login: string, password: string): Promise<void> {
    await this.loginInput.fill(login);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

class WorkItemsPage {
  readonly heading: Locator;
  readonly currentUser: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole("heading", { name: "Задачи" });
    this.currentUser = page.getByTestId("current-user");
  }
}

test("выражает сценарий через пользовательское действие", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const workItemsPage = new WorkItemsPage(page);

  await loginPage.open();
  await loginPage.signInAs(SUT_USERS.tester.login, SUT_USERS.tester.password);

  // Ключевая проверка сценария остаётся в тесте: именно результат входа
  // является предметом этого теста, а не деталью реализации страницы.
  await expect(workItemsPage.heading).toBeVisible();
  await expect(workItemsPage.currentUser).toContainText(SUT_USERS.tester.login);
});

test("показывает безопасную ошибку при неверных данных", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.signInAs(SUT_USERS.tester.login, "wrong-password");

  await expect(loginPage.error).toBeVisible();
  // Сообщение не должно подсказывать, существует ли учётная запись.
  await expect(loginPage.error).toHaveText("Неверный логин или пароль");
});
