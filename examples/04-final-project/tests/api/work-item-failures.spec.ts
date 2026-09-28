import { expect, test } from "../../src/fixtures/api-fixture.js";

test("неизвестный идентификатор даёт 404 с разобранным телом отказа", async ({
  workItems,
}) => {
  const result = await workItems.getById("00000000-0000-4000-8000-000000000000");

  expect(result.ok).toBe(false);

  if (result.ok) return;

  expect(result.failure.status).toBe(404);
  // Проверяется код отказа, а не текст: текст может меняться.
  expect(result.failure.code.length).toBeGreaterThan(0);
});

test("устаревшая версия отклоняется, а запись остаётся прежней", async ({
  workItems,
  createOwnedWorkItem,
}) => {
  const created = await createOwnedWorkItem({
    title: `final-project-conflict-${Date.now()}`,
    description: "Сценарий конфликта версий",
    priority: "LOW",
  });

  const moved = await workItems.transition(created.id, "IN_PROGRESS", created.version);

  expect(moved.ok).toBe(true);

  // Второй переход идёт по версии, которая уже устарела.
  const stale = await workItems.transition(created.id, "DONE", created.version);

  expect(stale.ok).toBe(false);

  if (stale.ok) return;

  expect(stale.failure.status).toBe(409);

  // Отказ не должен оставлять следов: читаем состояние отдельным запросом.
  const actual = await workItems.getById(created.id);

  expect(actual.ok).toBe(true);

  if (!actual.ok) return;

  expect(actual.value.status).toBe("IN_PROGRESS");
});
