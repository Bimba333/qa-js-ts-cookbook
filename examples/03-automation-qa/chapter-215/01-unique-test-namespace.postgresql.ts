import { countWorkItemsByRun, withReaderClient } from "../support/sut/database.js";
import { SUT_USERS } from "../support/sut/config.js";
import { expect, test } from "../support/sut/fixtures.js";
import {
  issueToken,
  toCreatorTestId,
  WorkItemsApi,
} from "../support/sut/work-items-api.js";

test("разделяет данные параллельных сценариев через test run", async ({
  request,
}, testInfo) => {
  // Два независимых сценария создают записи с одинаковым заголовком.
  // В реальном прогоне так выглядят два worker'а, выполняющих один тест.
  const runScenario = async (marker: string) => {
    const token = await issueToken(request, SUT_USERS.tester);
    const api = new WorkItemsApi(
      request,
      token.accessToken,
      toCreatorTestId(`${testInfo.title}-${marker}`),
    );
    const item = await api.createOrThrow({
      title: "Одинаковый логический заголовок",
      description: "Записи разных запусков не пересекаются",
      priority: "LOW",
    });

    return { api, token, item };
  };

  const [first, second] = await Promise.all([
    runScenario("a"),
    runScenario("b"),
  ]);

  try {
    // Запуски разные, поэтому одинаковые данные не конфликтуют.
    expect(first.token.testRunId).not.toBe(second.token.testRunId);
    expect(first.item.id).not.toBe(second.item.id);
    expect(first.item.testRunId).toBe(first.token.testRunId);

    await withReaderClient(async (client) => {
      expect(await countWorkItemsByRun(client, first.token.testRunId)).toBe(1);
      expect(await countWorkItemsByRun(client, second.token.testRunId)).toBe(1);
    });

    // Очистка одного запуска не затрагивает соседний.
    const cleanup = await first.api.cleanupRun();
    expect(cleanup.status()).toBe(200);
    expect(await cleanup.json()).toMatchObject({ deletedCount: 1 });

    await withReaderClient(async (client) => {
      expect(await countWorkItemsByRun(client, first.token.testRunId)).toBe(0);
      expect(await countWorkItemsByRun(client, second.token.testRunId)).toBe(1);
    });
  } finally {
    await second.api.cleanupRun();
  }
});
