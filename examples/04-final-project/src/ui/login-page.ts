import type { Page } from "@playwright/test";

export type Credentials = Readonly<{ login: string; password: string }>;

/**
 * Страница входа.
 *
 * Наружу отдаются шаги, а не элементы: сценарий говорит «войти», а знание о
 * полях и кнопке остаётся здесь. Это граница, ради которой page object и
 * существует.
 */
export class LoginPage {
  readonly #page: Page;

  constructor(page: Page) {
    this.#page = page;
  }

  async open(): Promise<void> {
    await this.#page.goto("/login");
  }

  async signIn(credentials: Credentials): Promise<void> {
    await this.#page.getByLabel("Логин").fill(credentials.login);
    await this.#page.getByLabel("Пароль").fill(credentials.password);
    await this.#page.getByRole("button", { name: "Войти" }).click();
    await this.#page.waitForURL(/\/work-items/);
  }
}
