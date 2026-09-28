import { expect, test } from "../../src/fixtures/database-fixture.js";

test("созданная через REST запись видна в базе с теми же значениями", async ({
  createOwnedWorkItem,
  workItemsRepository,
}) => {
  const created = await createOwnedWorkItem({
    title: `final-project-db-${Date.now()}`,
    description: "Проверка сохранённого состояния",
    priority: "HIGH",
  });

  const row = await workItemsRepository.findById(created.id);

  expect(row).toBeDefined();

  if (!row) return;

  expect(row.title).toBe(created.title);
  expect(row.status).toBe("NEW");
  expect(row.priority).toBe("HIGH");
  // Запись создана тестом, а не наполнением стенда: признак отличает её
  // от справочных данных, которые трогать нельзя.
  expect(row.is_seed).toBe(false);
  expect(row.version).toBe(created.version);
});

test("описание сохраняется как есть, а не превращается в NULL", async ({
  createOwnedWorkItem,
  workItemsRepository,
}) => {
  const description = "Описание со спецсимволами: ' \" % _ \\";
  const created = await createOwnedWorkItem({
    title: `final-project-db-text-${Date.now()}`,
    description,
    priority: "LOW",
  });

  const row = await workItemsRepository.findById(created.id);

  expect(row?.description).toBe(description);
});

test("справочные данные существуют и не принадлежат прогону", async ({
  workItemsRepository,
}) => {
  const titles = await workItemsRepository.findSeedTitles(3);

  expect(titles.length).toBe(3);
  expect(new Set(titles).size).toBe(3);
});
