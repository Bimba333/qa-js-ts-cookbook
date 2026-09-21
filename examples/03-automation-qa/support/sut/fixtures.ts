import { test as base } from "@playwright/test";

import { SUT_USERS, type SutConfig, sutConfig } from "./config.js";
import {
  createWorkItemsClient,
  WorkItemsGrpcClient,
} from "./grpc-client.js";
import {
  issueToken,
  toCreatorTestId,
  WorkItemsApi,
  type IssuedToken,
} from "./work-items-api.js";

export type SutFixtures = {
  sut: SutConfig;
  /** Токен tester и связанный с ним test run. */
  testerToken: IssuedToken;
  /** Клиент REST-границы, который сам убирает за собой. */
  workItems: WorkItemsApi;
  /**
   * Клиент gRPC-границы с тем же токеном, что и REST.
   *
   * Общий токен означает общий test run: запись, созданная через REST,
   * доступна gRPC-вызову, а очистка в teardown удаляет её один раз.
   */
  workItemsGrpc: WorkItemsGrpcClient;
};

/**
 * Фикстуры стенда.
 *
 * Каждый тест получает собственный токен, а значит и собственный test run.
 * Это и есть граница изоляции: параллельные тесты не видят данные друг друга,
 * а очистка в teardown удаляет ровно свой запуск.
 */
export const test = base.extend<SutFixtures>({
  sut: async ({}, use) => {
    await use(sutConfig());
  },

  testerToken: async ({ request }, use) => {
    await use(await issueToken(request, SUT_USERS.tester));
  },

  workItems: async ({ request, testerToken }, use, testInfo) => {
    const api = new WorkItemsApi(
      request,
      testerToken.accessToken,
      toCreatorTestId(testInfo.title),
    );

    await use(api);

    // Teardown выполняется всегда, в том числе после упавшего теста:
    // иначе неудачный прогон оставлял бы данные следующему.
    await api.cleanupRun();
  },

  workItemsGrpc: async ({ testerToken }, use, testInfo) => {
    const client = new WorkItemsGrpcClient(createWorkItemsClient(), {
      token: testerToken.accessToken,
      correlationId: `example-${testInfo.testId}`,
      creatorTestId: toCreatorTestId(testInfo.title),
    });

    await use(client);

    // Клиент держит соединение, поэтому закрывается явно.
    client.close();
  },
});

export { expect } from "@playwright/test";
