import { expect, test } from "../support/sut/fixtures.js";

test("получает один response на один unary request", async ({
  workItems,
  workItemsGrpc,
}) => {
  const created = await workItems.createOrThrow({
    title: "Unary call",
    description: "Один запрос — один ответ",
    priority: "MEDIUM",
  });

  const first = await workItemsGrpc.getWorkItem(created.id);
  const second = await workItemsGrpc.getWorkItem(created.id);

  // Unary-вызов возвращает ровно одно сообщение и завершается.
  // Повторный вызов — это новый запрос, а не продолжение предыдущего.
  expect(second).toEqual(first);
  expect(first.id).toBe(created.id);

  // Тот же метод с другим аргументом возвращает другое сообщение:
  // ответ определяется запросом, а не состоянием соединения.
  const page = await workItemsGrpc.searchWorkItems({ limit: 2 });
  expect(page.items.length).toBeLessThanOrEqual(2);
  expect(page.total).toBeGreaterThan(0);
});
