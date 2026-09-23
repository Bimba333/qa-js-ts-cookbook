import fs from "node:fs/promises";
import path from "node:path";

import type { Browser, BrowserContext } from "@playwright/test";

import { LoginPage, type Credentials } from "./login-page.js";

export type SessionOptions = Readonly<{
  browser: Browser;
  baseUrl: string;
  credentials: Credentials;
  statePath: string;
}>;

/**
 * Состояние входа, пригодное для повторного использования.
 *
 * Вход через форму выполняется один раз и сохраняется на диск. Дальше каждый
 * тест открывает СВОЙ контекст с этим состоянием: сессия не общая, поэтому
 * тесты не мешают друг другу, но и форму входа никто больше не проходит.
 */
export async function ensureAuthenticatedState(options: SessionOptions): Promise<string> {
  const { browser, baseUrl, credentials, statePath } = options;

  try {
    await fs.access(statePath);

    return statePath;
  } catch {
    // Состояния ещё нет — значит, его надо создать.
  }

  await fs.mkdir(path.dirname(statePath), { recursive: true });

  const context = await browser.newContext({ baseURL: baseUrl });

  try {
    const page = await context.newPage();
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.signIn(credentials);

    await context.storageState({ path: statePath });
  } finally {
    await context.close();
  }

  return statePath;
}

/**
 * Проверяет, что восстановленное состояние всё ещё даёт доступ.
 *
 * Сохранённая сессия живёт ограниченное время. Без этой проверки первый
 * прогон после истечения срока падал бы не на своей причине: тест увидел бы
 * форму входа вместо списка и сообщил о «пропавшем элементе».
 */
async function stateStillWorks(context: BrowserContext): Promise<boolean> {
  const page = await context.newPage();

  try {
    await page.goto("/work-items");

    return !page.url().includes("/login");
  } finally {
    await page.close();
  }
}

export async function createAuthenticatedContext(
  options: SessionOptions,
): Promise<BrowserContext> {
  const statePath = await ensureAuthenticatedState(options);

  const context = await options.browser.newContext({
    baseURL: options.baseUrl,
    storageState: statePath,
  });

  if (await stateStillWorks(context)) {
    return context;
  }

  await context.close();
  await fs.rm(statePath, { force: true });

  const refreshedPath = await ensureAuthenticatedState(options);

  return options.browser.newContext({
    baseURL: options.baseUrl,
    storageState: refreshedPath,
  });
}
