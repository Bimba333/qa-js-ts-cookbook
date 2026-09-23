import path from "node:path";

import { test as base, type Page } from "@playwright/test";

import {
  createFoundation,
  type FoundationContext,
} from "../composition/index.js";
import {
  validateRuntimeConfig,
  type RawEnvironment,
} from "../config/index.js";
import {
  createAuthenticatedContext,
  LoginPage,
  WorkItemCardPage,
  WorkItemsPage,
  type Credentials,
} from "../ui/index.js";

type UiOptions = {
  uiSource: RawEnvironment;
  credentials: Credentials;
};

type UiFixtures = {
  foundation: FoundationContext;
  uiPage: Page;
  workItemsPage: WorkItemsPage;
  workItemCardPage: WorkItemCardPage;
  loginPage: LoginPage;
};

/**
 * Настройки берутся из окружения, а значения по умолчанию описывают локальный
 * учебный стенд. Прикладного знания о стенде в слое конфигурации нет: сюда
 * приходят уже проверенные значения.
 */
const LOCAL_SOURCE: RawEnvironment = Object.freeze({
  QA_PROFILE: process.env.QA_PROFILE ?? "local",
  QA_UI_BASE_URL: process.env.QA_UI_BASE_URL ?? "http://127.0.0.1:4310",
  QA_REST_BASE_URL: process.env.QA_REST_BASE_URL ?? "http://127.0.0.1:4310/api/v1",
  QA_GRPC_TARGET: process.env.QA_GRPC_TARGET ?? "127.0.0.1:4311",
  QA_POSTGRES_CONNECTION_REF:
    process.env.QA_POSTGRES_CONNECTION_REF ?? "secret://local/postgres",
  QA_CREDENTIALS_REF: process.env.QA_CREDENTIALS_REF ?? "secret://local/qa-credentials",
  QA_OPERATION_TIMEOUT_MS: process.env.QA_OPERATION_TIMEOUT_MS ?? "15000",
  QA_ARTIFACT_DIR: process.env.QA_ARTIFACT_DIR ?? "test-results/final-project",
  CI: process.env.CI ?? "false",
});

const LOCAL_CREDENTIALS: Credentials = Object.freeze({
  login: process.env.QA_UI_LOGIN ?? "educational_tester",
  password: process.env.QA_UI_PASSWORD ?? "educational-tester-password",
});

export const test = base.extend<UiFixtures & UiOptions>({
  uiSource: [LOCAL_SOURCE, { option: true }],
  credentials: [LOCAL_CREDENTIALS, { option: true }],

  foundation: async ({ uiSource }, use) => {
    const runtime = createFoundation(validateRuntimeConfig(uiSource));
    let failure: { error: unknown } | undefined;

    try {
      await use(runtime.context);
    } catch (error) {
      failure = { error };
    }

    if (failure) {
      await runtime.close(failure.error);
      throw failure.error;
    }

    await runtime.close();
  },

  /**
   * Своя страница в своём контексте на каждый тест.
   *
   * Общий контекст сэкономил бы несколько секунд, но связал бы тесты общим
   * состоянием: один сценарий начал бы зависеть от того, что сделал соседний.
   */
  uiPage: async ({ browser, foundation, credentials }, use, testInfo) => {
    const context = await createAuthenticatedContext({
      browser,
      baseUrl: foundation.config.uiBaseUrl,
      credentials,
      statePath: path.join(
        foundation.config.artifactDirectory,
        "ui-auth-state.json",
      ),
    });

    await context.tracing.start({ screenshots: true, snapshots: true });

    const page = await context.newPage();

    await use(page);

    // Трасса сохраняется только у упавшего теста: у зелёного она никому
    // не нужна, а место и время прогона стоят дорого.
    const failed = testInfo.status !== testInfo.expectedStatus;

    if (failed) {
      const tracePath = testInfo.outputPath("ui-trace.zip");

      await context.tracing.stop({ path: tracePath });
      await testInfo.attach("ui-trace", { path: tracePath, contentType: "application/zip" });
      await testInfo.attach("ui-screenshot", {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    } else {
      await context.tracing.stop();
    }

    await context.close();
  },

  loginPage: async ({ uiPage }, use) => {
    await use(new LoginPage(uiPage));
  },

  workItemsPage: async ({ uiPage }, use) => {
    await use(new WorkItemsPage(uiPage));
  },

  workItemCardPage: async ({ uiPage }, use) => {
    await use(new WorkItemCardPage(uiPage));
  },
});

export { expect } from "@playwright/test";
