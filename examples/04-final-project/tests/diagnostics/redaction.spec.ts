import { expect, test } from "../../src/fixtures/diagnostics-fixture.js";
import { REDACTED, redactFields } from "../../src/diagnostics/index.js";

test("чувствительные поля маскируются по имени", async () => {
  const safe = redactFields({
    environment: "local",
    apiToken: "очень-секретно",
    DB_PASSWORD: "тоже-секретно",
    "storage-state": "путь",
    retries: 2,
  });

  expect(safe.environment).toBe("local");
  expect(safe.retries).toBe(2);
  expect(safe.apiToken).toBe(REDACTED);
  expect(safe.DB_PASSWORD).toBe(REDACTED);
  expect(safe["storage-state"]).toBe(REDACTED);
});

test("журнал маскирует значения до записи события", async ({ log }) => {
  log.step("вход выполнен", { login: "educational_tester", authorization: "Bearer abc" });

  const [event] = log.events;

  expect(event?.fields.login).toBe("educational_tester");
  expect(event?.fields.authorization).toBe(REDACTED);
  // Секрет не должен встречаться в записи ни в каком виде.
  expect(JSON.stringify(event).includes("abc")).toBe(false);
});

test("связывающий идентификатор одинаков у всех событий теста", async ({ log }) => {
  log.step("первый шаг");
  log.step("второй шаг");

  const identifiers = new Set(log.events.map((event) => event.correlationId));

  expect(identifiers.size).toBe(1);
  // Проверяется форма, а не конкретные числа: индекс рабочего процесса
  // зависит от расписания запуска и меняется между прогонами.
  expect(log.correlationId).toMatch(/^fp-diagnostics-w\d+-r\d+-[0-9a-f]{8}$/);
});
