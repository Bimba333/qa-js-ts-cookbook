import { expect, type Locator, type Page, test } from "@playwright/test";

class LoginPage {
  readonly heading: Locator;
  readonly emailInput: Locator;
  readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole("heading", { name: "Вход" });
    this.emailInput = page.getByLabel("Email");
    this.submitButton = page.getByRole("button", { name: "Войти" });
  }

  async open(): Promise<void> {
    await this.page.setContent(`
      <main>
        <h1>Вход</h1>
        <label>Email <input type="email"></label>
        <button>Войти</button>
        <p role="status"></p>
      </main>
      <script>
        document.querySelector("button").addEventListener("click", () => {
          document.querySelector('[role="status"]').textContent = "Сессия создана";
        });
      </script>
    `);
  }

  async loginAs(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }
}

test("выражает сценарий через пользовательское действие", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.loginAs("qa@example.test");

  await expect(page.getByRole("status")).toHaveText("Сессия создана");
});
