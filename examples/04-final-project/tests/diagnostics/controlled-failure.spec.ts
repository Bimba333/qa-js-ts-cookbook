import { expect, test } from "../../src/fixtures/diagnostics-fixture.js";
import {
  attachEvidence,
  buildEvidence,
} from "../../src/diagnostics/index.js";

test("пакет доказательств прикладывается и не содержит секретов", async (
  { log },
  testInfo,
) => {
  log.step("подготовка данных", { entityId: "fp-controlled-1" });
  log.step("выполнение действия", { operation: "transition", token: "очень-секретно" });
  log.failure("проверка не прошла", { expected: "DONE", actual: "NEW" });

  const failure = new Error("шаг сценария не выполнен", {
    cause: new Error("сервис вернул NEW вместо DONE"),
  });

  await attachEvidence(
    testInfo,
    buildEvidence(testInfo, log.correlationId, log.events, failure),
  );

  const attached = testInfo.attachments.find(
    (item) => item.name === "scenario-evidence",
  );

  expect(attached).toBeDefined();
  expect(attached?.contentType).toBe("application/json");

  const text = attached?.body?.toString("utf8") ?? "";

  expect(text).toContain(log.correlationId);
  expect(text).toContain("шаг сценария не выполнен");
  expect(text).toContain("сервис вернул NEW вместо DONE");
  // Секрет замаскирован при записи события и потому не доходит до вложения.
  expect(text.includes("очень-секретно")).toBe(false);
});

/**
 * Тонкость, о которую легко споткнуться.
 *
 * `test.fail()` объявляет падение ОЖИДАЕМЫМ, поэтому фактический итог
 * совпадает с ожидаемым, и хук диагностики не срабатывает. Автоматические
 * доказательства собираются только при расхождении итогов.
 */
test("ожидаемое падение не считается расхождением итогов", async ({ log }, testInfo) => {
  test.fail();

  log.step("шаг перед заведомо неверной проверкой");

  expect(testInfo.expectedStatus).toBe("failed");
  expect("NEW").toBe("DONE");
});
