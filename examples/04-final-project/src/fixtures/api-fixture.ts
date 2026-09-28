import { test as base, request as playwrightRequest } from "@playwright/test";
import type { APIRequestContext } from "@playwright/test";

import {
  cleanupTestRun,
  openSession,
  RestClient,
  WorkItemsClient,
  type ApiCredentials,
  type ApiSession,
  type CreateWorkItemInput,
  type WorkItem,
} from "../api/index.js";
import {
  createFoundation,
  type FoundationContext,
} from "../composition/index.js";
import {
  validateRuntimeConfig,
  type RawEnvironment,
} from "../config/index.js";

type ApiOptions = {
  apiSource: RawEnvironment;
  apiCredentials: ApiCredentials;
};

type ApiFixtures = {
  foundation: FoundationContext;
  apiRequest: APIRequestContext;
  /** Одна сессия на тест: каждый выпуск токена открывает новый прогон. */
  session: ApiSession;
  workItems: WorkItemsClient;
  /** Создаёт задачу и сразу берёт на себя её удаление. */
  createOwnedWorkItem: (input: CreateWorkItemInput) => Promise<WorkItem>;
};

const LOCAL_SOURCE: RawEnvironment = Object.freeze({
  QA_PROFILE: process.env.QA_PROFILE ?? "local",
  QA_UI_BASE_URL: process.env.QA_UI_BASE_URL ?? "http://127.0.0.1:4310",
  QA_REST_BASE_URL:
    process.env.QA_REST_BASE_URL ?? "http://127.0.0.1:4310/api/v1",
  QA_GRPC_TARGET: process.env.QA_GRPC_TARGET ?? "127.0.0.1:4311",
  QA_POSTGRES_CONNECTION_REF:
    process.env.QA_POSTGRES_CONNECTION_REF ?? "secret://local/postgres",
  QA_CREDENTIALS_REF:
    process.env.QA_CREDENTIALS_REF ?? "secret://local/qa-credentials",
  QA_OPERATION_TIMEOUT_MS: process.env.QA_OPERATION_TIMEOUT_MS ?? "15000",
  QA_ARTIFACT_DIR: process.env.QA_ARTIFACT_DIR ?? "test-results/final-project",
  CI: process.env.CI ?? "false",
});

const LOCAL_CREDENTIALS: ApiCredentials = Object.freeze({
  login: process.env.QA_API_LOGIN ?? "educational_tester",
  password: process.env.QA_API_PASSWORD ?? "educational-tester-password",
});

export const test = base.extend<ApiFixtures & ApiOptions>({
  apiSource: [LOCAL_SOURCE, { option: true }],
  apiCredentials: [LOCAL_CREDENTIALS, { option: true }],

  foundation: async ({ apiSource }, use) => {
    const runtime = createFoundation(validateRuntimeConfig(apiSource));
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
   * Свой контекст запросов на тест.
   *
   * Встроенная фикстура `request` не подошла бы: ей нельзя задать базовый
   * адрес стенда из проверенной конфигурации, а общий контекст связал бы
   * тесты общими куки.
   */
  apiRequest: async ({ foundation }, use) => {
    const context = await playwrightRequest.newContext({
      baseURL: foundation.config.restBaseUrl,
      timeout: foundation.config.operationTimeoutMs,
    });

    await use(context);
    await context.dispose();
  },

  session: async ({ apiRequest, foundation, apiCredentials }, use) => {
    await use(
      await openSession(
        apiRequest,
        foundation.config.restBaseUrl,
        apiCredentials,
      ),
    );
  },

  workItems: async ({ apiRequest, foundation, session }, use) => {
    await use(
      new WorkItemsClient(
        new RestClient({
          request: apiRequest,
          baseUrl: foundation.config.restBaseUrl,
          token: session.token,
        }),
      ),
    );

    // Страховка: удаляем всё, что тест создал и не убрал сам.
    await cleanupTestRun(apiRequest, foundation.config.restBaseUrl, session.token);
  },

  createOwnedWorkItem: async ({ workItems }, use) => {
    const created: string[] = [];

    await use(async (input) => {
      const result = await workItems.create(input);

      if (!result.ok) {
        throw new Error(
          `Подготовка не удалась: ${result.failure.status} ${result.failure.code}`,
        );
      }

      // Регистрация очистки идёт сразу после успешного создания, а не в
      // конце теста: между этими точками может произойти что угодно.
      created.push(result.value.id);

      return result.value;
    });

    for (const id of created.reverse()) {
      await workItems.remove(id);
    }
  },
});

export { expect } from "@playwright/test";
