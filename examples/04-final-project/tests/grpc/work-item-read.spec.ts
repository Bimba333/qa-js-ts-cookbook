import { expect, test } from "../../src/fixtures/grpc-fixture.js";

test("запись, созданная через REST, читается через gRPC с теми же данными", async ({
  createOwnedWorkItem,
  workItemsGrpc,
}) => {
  const created = await createOwnedWorkItem({
    title: `final-project-grpc-${Date.now()}`,
    description: "Создано подготовкой через REST",
    priority: "MEDIUM",
  });

  const read = await workItemsGrpc.getById(created.id);

  expect(read.ok).toBe(true);

  if (!read.ok) return;

  expect(read.value.id).toBe(created.id);
  expect(read.value.title).toBe(created.title);
  // Перечисление приходит строкой, а не числом: так настроен загрузчик.
  expect(read.value.status).toBe("NEW");
  expect(read.value.version).toBe(created.version);
});

test("переход через gRPC меняет статус и увеличивает версию", async ({
  createOwnedWorkItem,
  workItemsGrpc,
}) => {
  const created = await createOwnedWorkItem({
    title: `final-project-grpc-move-${Date.now()}`,
    description: "Проверка унарного перехода",
    priority: "LOW",
  });

  const moved = await workItemsGrpc.transition(
    created.id,
    "IN_PROGRESS",
    created.version,
  );

  expect(moved.ok).toBe(true);

  if (!moved.ok) return;

  expect(moved.value.status).toBe("IN_PROGRESS");
  expect(moved.value.version).toBeGreaterThan(created.version);
});
