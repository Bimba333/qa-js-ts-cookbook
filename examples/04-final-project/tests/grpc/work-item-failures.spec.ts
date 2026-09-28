import { expect, test } from "../../src/fixtures/grpc-fixture.js";
import { grpc } from "../../src/grpc/index.js";

test("неизвестный идентификатор даёт NOT_FOUND, а не пустой ответ", async ({
  workItemsGrpc,
}) => {
  const result = await workItemsGrpc.getById(
    "00000000-0000-4000-8000-000000000000",
  );

  expect(result.ok).toBe(false);

  if (result.ok) return;

  // Сверяется константа, а не число: 5 читателю ничего не говорит.
  expect(result.failure.code).toBe(grpc.status.NOT_FOUND);
  expect(result.failure.codeName).toBe("NOT_FOUND");
});

test("устаревшая версия даёт FAILED_PRECONDITION и не меняет запись", async ({
  createOwnedWorkItem,
  workItemsGrpc,
}) => {
  const created = await createOwnedWorkItem({
    title: `final-project-grpc-conflict-${Date.now()}`,
    description: "Проверка конфликта версий через gRPC",
    priority: "LOW",
  });

  const moved = await workItemsGrpc.transition(
    created.id,
    "IN_PROGRESS",
    created.version,
  );

  expect(moved.ok).toBe(true);

  const stale = await workItemsGrpc.transition(
    created.id,
    "DONE",
    created.version,
  );

  expect(stale.ok).toBe(false);

  if (stale.ok) return;

  expect(stale.failure.code).toBe(grpc.status.FAILED_PRECONDITION);

  // Отказ не должен оставлять следов: состояние читается отдельным вызовом.
  const actual = await workItemsGrpc.getById(created.id);

  expect(actual.ok).toBe(true);

  if (!actual.ok) return;

  expect(actual.value.status).toBe("IN_PROGRESS");
});

test("истёкший крайний срок даёт DEADLINE_EXCEEDED", async ({
  createOwnedWorkItem,
  workItemsGrpc,
}) => {
  const created = await createOwnedWorkItem({
    title: `final-project-grpc-deadline-${Date.now()}`,
    description: "Проверка границы времени вызова",
    priority: "LOW",
  });

  // Срок заведомо недостижим: проверяется механизм, а не скорость стенда.
  const result = await workItemsGrpc.getByIdWithDeadline(created.id, 1);

  expect(result.ok).toBe(false);

  if (result.ok) return;

  expect(result.failure.code).toBe(grpc.status.DEADLINE_EXCEEDED);
});
