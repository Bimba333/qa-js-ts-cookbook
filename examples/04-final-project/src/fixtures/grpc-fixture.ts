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
  createGeneratedClient,
  waitForReady,
  WorkItemsGrpcClient,
  type WorkItemServiceClient,
} from "../grpc/index.js";
import {
  createFoundation,
  type FoundationContext,
} from "../composition/index.js";
import {
  validateRuntimeConfig,
  type RawEnvironment,
} from "../config/index.js";

type GrpcOptions = {
  grpcSource: RawEnvironment;
  grpcCredentials: ApiCredentials;
};

type GrpcFixtures = {
  foundation: FoundationContext;
  apiRequest: APIRequestContext;
  /** Одна сессия на тест: подготовка и вызовы gRPC идут в одном прогоне. */
  session: ApiSession;
  /** Подготовка данных идёт через REST: gRPC-контракт стенда не создаёт записи. */
  createOwnedWorkItem: (input: CreateWorkItemInput) => Promise<WorkItem>;
  workItemsGrpc: WorkItemsGrpcClient;
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

export const test = base.extend<GrpcFixtures & GrpcOptions>({
  grpcSource: [LOCAL_SOURCE, { option: true }],
  grpcCredentials: [LOCAL_CREDENTIALS, { option: true }],

  foundation: async ({ grpcSource }, use) => {
    const runtime = createFoundation(validateRuntimeConfig(grpcSource));
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

  session: async ({ apiRequest, foundation, grpcCredentials }, use) => {
    await use(
      await openSession(
        apiRequest,
        foundation.config.restBaseUrl,
        grpcCredentials,
      ),
    );
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

  /**
   * Канал создаёт фикстура, она же его закрывает.
   *
   * Незакрытый канал держит соединение, и процесс запускающего инструмента
   * может не завершиться после прохождения всех тестов.
   */
  workItemsGrpc: async ({ foundation, session }, use, testInfo) => {
    let client: WorkItemServiceClient | undefined;

    try {
      client = createGeneratedClient(foundation.config.grpcTarget);

      await waitForReady(client, 5_000);

      await use(
        new WorkItemsGrpcClient(client, {
          token: session.token,
          correlationId: `final-project-${testInfo.testId}`,
          deadlineMs: 5_000,
        }),
      );
    } finally {
      client?.close();
    }
  },
});

export { expect } from "@playwright/test";
