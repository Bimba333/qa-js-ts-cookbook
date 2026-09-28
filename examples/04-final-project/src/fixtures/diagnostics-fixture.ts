import { test as base } from "@playwright/test";

import {
  attachEvidence,
  buildEvidence,
  ScenarioLog,
} from "../diagnostics/index.js";

type DiagnosticsFixtures = {
  /** Журнал сценария: один связывающий идентификатор на тест. */
  log: ScenarioLog;
};

export const test = base.extend<DiagnosticsFixtures>({
  log: async ({}, use, testInfo) => {
    const log = new ScenarioLog({
      // Идентификатор собран из признаков запуска: по нему записи журнала
      // соединяются с конкретной попыткой конкретного теста.
      correlationId: [
        "fp",
        testInfo.project.name,
        `w${testInfo.workerIndex}`,
        `r${testInfo.retry}`,
        testInfo.testId.slice(0, 8),
      ].join("-"),
    });

    await use(log);

    // Доказательства собираются после сценария и только при расхождении
    // фактического и ожидаемого итога. Хук не меняет результат теста.
    const failed = testInfo.status !== testInfo.expectedStatus;

    if (failed) {
      await attachEvidence(
        testInfo,
        buildEvidence(testInfo, log.correlationId, log.events, testInfo.error),
      );
    }
  },
});

export { expect } from "@playwright/test";
