import { expect, type Page } from "@playwright/test";

import { sutConfig, SUT_USERS, type SutConfig } from "./config.js";

export type UiCredentials = Readonly<{ login: string; password: string }>;

/**
 * Выполняет вход через форму.
 *
 * Элементы находятся по доступному имени и подписи, а не по вёрстке: так
 * сценарий переживает изменения разметки и читается как действие пользователя.
 */
export async function signIn(
  page: Page,
  credentials: UiCredentials = SUT_USERS.tester,
  config: SutConfig = sutConfig(),
): Promise<void> {
  await page.goto(`${config.baseURL}/login`);
  await page.getByLabel("Логин").fill(credentials.login);
  await page.getByLabel("Пароль").fill(credentials.password);
  await page.getByRole("button", { name: "Войти" }).click();

  await expect(page.getByRole("heading", { name: "Задачи" })).toBeVisible();
}

export async function openWorkItems(
  page: Page,
  config: SutConfig = sutConfig(),
): Promise<void> {
  await page.goto(`${config.baseURL}/work-items`);
}

export async function openWorkItem(
  page: Page,
  id: string,
  config: SutConfig = sutConfig(),
): Promise<void> {
  await page.goto(`${config.baseURL}/work-items/${id}`);
}
