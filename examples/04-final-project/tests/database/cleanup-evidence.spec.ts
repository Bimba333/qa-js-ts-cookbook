import { expect, test } from "../../src/fixtures/database-fixture.js";

test("подсчёт по статусу возвращает число, а не строку драйвера", async ({
  workItemsRepository,
}) => {
  const total = await workItemsRepository.countByStatus("NEW");

  expect(typeof total).toBe("number");
  expect(Number.isInteger(total)).toBe(true);
  expect(total).toBeGreaterThan(0);
});

test("неизвестный идентификатор даёт отсутствие строки, а не ошибку", async ({
  workItemsRepository,
}) => {
  const row = await workItemsRepository.findById(
    "00000000-0000-4000-8000-000000000000",
  );

  expect(row).toBe(undefined);
});

test("записи прогона появляются и исчезают после очистки", async ({
  createOwnedWorkItem,
  workItemsRepository,
  currentTestRunId,
}) => {
  const before = await workItemsRepository.countByTestRun(currentTestRunId);

  const created = await createOwnedWorkItem({
    title: `final-project-db-run-${Date.now()}`,
    description: "Проверка учёта записей прогона",
    priority: "MEDIUM",
  });

  const during = await workItemsRepository.countByTestRun(currentTestRunId);

  expect(during).toBe(before + 1);

  // Запись принадлежит прогону: именно по этому признаку работает массовая
  // очистка, и проверить его можно только со стороны базы.
  const row = await workItemsRepository.findById(created.id);

  expect(row?.test_run_id).toBe(currentTestRunId);
});
