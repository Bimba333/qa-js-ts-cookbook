import { expect, test } from "../support/sut/fixtures.js";

/**
 * Фикстура `workItemsGrpc` отдаёт клиент предметной области.
 *
 * Тест не создаёт соединение, не собирает metadata и не задаёт deadline —
 * всё это принадлежит адаптеру. Сценарий остаётся на языке домена, а смена
 * транспорта не переписывает тесты.
 */
test("предоставляет domain client через fixture", async ({
  workItems,
  workItemsGrpc,
}) => {
  const created = await workItems.createOrThrow({
    title: "Framework boundary",
    description: "Клиент домена поверх сгенерированного stub",
    priority: "MEDIUM",
  });

  const received = await workItemsGrpc.getWorkItem(created.id);
  expect(received.id).toBe(created.id);

  const transitioned = await workItemsGrpc.transitionWorkItem({
    id: created.id,
    targetStatus: "CANCELLED",
    expectedVersion: created.version,
  });

  expect(transitioned.item?.status).toBe("CANCELLED");
});
