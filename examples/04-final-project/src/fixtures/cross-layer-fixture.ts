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
} from "../api/index.js";
import {
  resolveDatabaseSettings,
  WorkItemsRepository,
} from "../database/index.js";
import {
  createGeneratedClient,
  readRawWorkItem,
  waitForReady,
  type CallContext,
  type GrpcResult,
  type WorkItemServiceClient,
} from "../grpc/index.js";
import { OwnedData, TestDataIdentity } from "../test-data/index.js";
import {
  createFoundation,
  type FoundationContext,
} from "../composition/index.js";
import {
  validateRuntimeConfig,
  type RawEnvironment,
} from "../config/index.js";

type CrossLayerOptions = {
  crossLayerSource: RawEnvironment;
  crossLayerCredentials: ApiCredentials;
};

export type CrossLayerContext = Readonly<{
  rest: WorkItemsClient;
  repository: WorkItemsRepository;
  readGrpc: (id: string) => Promise<GrpcResult<unknown>>;
  identity: TestDataIdentity;
  owned: OwnedData;
  session: ApiSession;
}>;

type CrossLayerFixtures = {
  foundation: FoundationContext;
  apiRequest: APIRequestContext;
  session: ApiSession;
  /** Один контекст на тест: все слои собраны в одном месте. */
  layers: CrossLayerContext;
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

export const test = base.extend<CrossLayerFixtures & CrossLayerOptions>({
  crossLayerSource: [LOCAL_SOURCE, { option: true }],
  crossLayerCredentials: [LOCAL_CREDENTIALS, { option: true }],

  foundation: async ({ crossLayerSource }, use) => {
    const runtime = createFoundation(validateRuntimeConfig(crossLayerSource));
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

  session: async ({ apiRequest, foundation, crossLayerCredentials }, use) => {
    await use(
      await openSession(
        apiRequest,
        foundation.config.restBaseUrl,
        crossLayerCredentials,
      ),
    );
  },

  /**
   * Composition Root межслойного сценария.
   *
   * Все три транспорта и реестр владения собираются здесь. Сценарий получает
   * готовый контекст и не создаёт ни клиентов, ни пулов, ни каналов.
   */
  layers: async ({ apiRequest, foundation, session }, use, testInfo) => {
    const rest = new WorkItemsClient(
      new RestClient({
        request: apiRequest,
        baseUrl: foundation.config.restBaseUrl,
        token: session.token,
      }),
    );

    const pool = new pg.Pool({
      ...resolveDatabaseSettings(foundation.config.postgresConnectionReference),
      max: 2,
      application_name: "final-project-cross-layer",
    });

    let grpcClient: WorkItemServiceClient | undefined;
    const owned = new OwnedData();
    let failure: { error: unknown } | undefined;

    try {
      grpcClient = createGeneratedClient(foundation.config.grpcTarget);

      await waitForReady(grpcClient, 5_000);

      const callContext: CallContext = {
        token: session.token,
        correlationId: `final-project-cross-${testInfo.testId}`,
        deadlineMs: 5_000,
      };

      await use(
        Object.freeze({
          rest,
          repository: new WorkItemsRepository(pool),
          readGrpc: (id: string) =>
            readRawWorkItem(grpcClient as WorkItemServiceClient, callContext, id),
          identity: new TestDataIdentity({
            project: testInfo.project.name,
            workerIndex: testInfo.workerIndex,
            retry: testInfo.retry,
            testId: testInfo.testId,
          }),
          owned,
          session,
        }),
      );
    } catch (error) {
      failure = { error };
    }

    // Порядок освобождения обратный порядку создания, а исходная ошибка
    // сценария остаётся первой причиной.
    try {
      if (failure) await owned.release(failure.error);
      else await owned.release();
    } finally {
      grpcClient?.close();
      await pool.end();
      await cleanupTestRun(apiRequest, foundation.config.restBaseUrl, session.token);
    }
  },
});

export { expect } from "@playwright/test";
