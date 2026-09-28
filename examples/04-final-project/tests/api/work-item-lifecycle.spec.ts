import { expect, test } from "../../src/fixtures/api-fixture.js";

test("созданная задача доступна по идентификатору и переходит в DONE", async ({
  workItems,
  createOwnedWorkItem,
}) => {
  const created = await createOwnedWorkItem({
    title: `final-project-${Date.now()}`,
    description: "Создано сценарием финального проекта",
    priority: "HIGH",
  });

  expect(created.status).toBe("NEW");
  expect(created.version).toBe(1);

  const read = await workItems.getById(created.id);

  expect(read.ok).toBe(true);

  if (!read.ok) return;

  expect(read.value.title).toBe(created.title);
  expect(read.value.priority).toBe("HIGH");

  // Переход идёт по правилам предметной области: из NEW нельзя попасть
  // сразу в DONE, между ними обязателен IN_PROGRESS.
  const started = await workItems.transition(
    created.id,
    "IN_PROGRESS",
    read.value.version,
  );

  expect(started.ok).toBe(true);

  if (!started.ok) return;

  const finished = await workItems.transition(
    created.id,
    "DONE",
    started.value.version,
  );

  expect(finished.ok).toBe(true);

  if (!finished.ok) return;

  expect(finished.value.status).toBe("DONE");
  // Версия обязана расти на каждом переходе: иначе следующая запись прошла бы
  // по устаревшему состоянию и затёрла чужое изменение.
  expect(finished.value.version).toBeGreaterThan(started.value.version);
  expect(started.value.version).toBeGreaterThan(read.value.version);
});
