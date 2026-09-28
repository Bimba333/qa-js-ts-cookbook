import { expect, test } from "../../src/fixtures/diagnostics-fixture.js";
import {
  buildEvidence,
  describeFailure,
  serializeEvidence,
} from "../../src/diagnostics/index.js";

test("цепочка причин сохраняется целиком", async () => {
  const low = new Error("соединение закрыто");
  const mid = new Error("запрос не выполнен", { cause: low });
  const top = new Error("шаг сценария упал", { cause: mid });

  const [description] = describeFailure(top);

  expect(description?.message).toBe("шаг сценария упал");
  expect(description?.cause?.message).toBe("запрос не выполнен");
  expect(description?.cause?.cause?.message).toBe("соединение закрыто");
});

test("исходная ошибка остаётся первой в списке причин", async () => {
  const aggregate = new AggregateError(
    [new Error("ошибка сценария"), new Error("ошибка очистки")],
    "сценарий и очистка завершились ошибкой",
  );

  const described = describeFailure(aggregate);

  expect(described.length).toBe(2);
  expect(described[0]?.message).toBe("ошибка сценария");
});

test("замкнутая на себя причина не зацикливает разбор", async () => {
  const error = new Error("сам себе причина");

  error.cause = error;

  const [description] = describeFailure(error);

  expect(description?.message).toBe("сам себе причина");
  // Цепочка обрывается на повторе, но факт наличия причины сохраняется:
  // иначе разбор выглядел бы так, будто причины не было вовсе.
  expect(description?.cause?.message).toBe("сам себе причина");
  expect(description?.cause?.cause).toBe(undefined);
});

test("сериализация выдерживает цикл и ограничивает размер", async () => {
  const cyclic: Record<string, unknown> = { name: "контекст" };

  cyclic.self = cyclic;

  const text = serializeEvidence(cyclic);

  expect(text).toContain("циклическая ссылка");

  const huge = serializeEvidence({ payload: "x".repeat(200_000) });

  expect(huge).toContain("обрезано");
  expect(Buffer.byteLength(huge, "utf8")).toBeLessThan(100_000);
});

test("пакет доказательств содержит признаки запуска", async ({ log }, testInfo) => {
  log.step("подготовка завершена", { entityId: "t-1" });

  const evidence = buildEvidence(
    testInfo,
    log.correlationId,
    log.events,
    new Error("контролируемая ошибка"),
  );

  expect(evidence.project).toBe("diagnostics");
  expect(evidence.workerIndex).toBe(testInfo.workerIndex);
  expect(evidence.retry).toBe(0);
  expect(evidence.events.length).toBe(1);
  expect(evidence.failures?.length).toBe(1);
});
