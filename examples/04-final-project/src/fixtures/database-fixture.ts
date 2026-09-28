import { test as base, request as playwrightRequest } from "@playwright/test";
import type { APIRequestContext } from "@playwright/test";
import pg from "pg";

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
  resolveDatabaseSettings,
  WorkItemsRepository,
} from "../database/index.js";
import {
  createFoundation,
  type FoundationContext,
} from "../composition/index.js";
import {
  validateRuntimeConfig,
  type RawEnvironment,
} from "../config/index.js";

type DatabaseOptions = {
  databaseSource: RawEnvironment;
  databaseCredentials: ApiCredentials;
};

type DatabaseFixtures = {
  foundation: FoundationContext;
  apiRequest: APIRequestContext;
  /** Одна сессия на тест: иначе подготовка и проверки попадут в разные прогоны. */
  session: ApiSession;
  workItemsRepository: WorkItemsRepository;
  /** Подготовка через REST: запись в базу в обход границ запрещена ролью. */
  createOwnedWorkItem: (input: CreateWorkItemInput) => Promise<WorkItem>;
  currentTestRunId: string;
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

export const test = base.extend<DatabaseFixtures & DatabaseOptions>({
  databaseSource: [LOCAL_SOURCE, { option: true }],
  databaseCredentials: [LOCAL_CREDENTIALS, { option: true }],

  foundation: async ({ databaseSource }, use) => {
    const runtime = createFoundation(validateRuntimeConfig(databaseSource));
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

  apiRequest: async ({ foundation }, use) => {
    const context = await playwrightRequest.newContext({
      timeout: foundation.config.operationTimeoutMs,
    });

    await use(context);
    await context.dispose();
  },

  /**
   * Пул на тест, а не на прогон.
   *
   * Общий пул экономит открытие подключений, но переживает тест: при
   * параллельном запуске он становится общим изменяемым ресурсом, а его
   * освобождение перестаёт быть чьей-то обязанностью.
   */
  workItemsRepository: async ({ foundation }, use) => {
    const settings = resolveDatabaseSettings(
      foundation.config.postgresConnectionReference,
    );
    const pool = new pg.Pool({
      ...settings,
      max: 2,
      application_name: "final-project",
      connectionTimeoutMillis: foundation.config.operationTimeoutMs,
    });

    try {
      await use(new WorkItemsRepository(pool));
    } finally {
      await pool.end();
    }
  },

  session: async ({ apiRequest, foundation, databaseCredentials }, use) => {
    await use(
      await openSession(
        apiRequest,
        foundation.config.restBaseUrl,
        databaseCredentials,
      ),
    );
  },

  currentTestRunId: async ({ session }, use) => {
    await use(session.testRunId);
  },

  createOwnedWorkItem: async ({ apiRequest, foundation, session }, use) => {
    const rest = new WorkItemsClient(
      new RestClient({
        request: apiRequest,
        baseUrl: foundation.config.restBaseUrl,
        token: session.token,
      }),
    );
    const created: string[] = [];

    await use(async (input) => {
      const result = await rest.create(input);

      if (!result.ok) {
        throw new Error(
          `Подготовка не удалась: ${result.failure.status} ${result.failure.code}`,
        );
      }

      created.push(result.value.id);

      return result.value;
    });

    for (const id of created.reverse()) {
      await rest.remove(id);
    }

    await cleanupTestRun(apiRequest, foundation.config.restBaseUrl, session.token);
  },
});

export { expect } from "@playwright/test";
