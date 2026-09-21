import { expect, test } from "../support/sut/fixtures.js";

test("проверяет repeated, enum, nested и значения по умолчанию", async ({
  workItems,
  workItemsGrpc,
}) => {
  const created = await workItems.createOrThrow({
    title: "Проверить поля контракта",
    description: "Разные виды полей protobuf",
    priority: "HIGH",
  });

  // enum приходит строкой, потому что клиент загружен с `enums: String`.
  const item = await workItemsGrpc.getWorkItem(created.id);
  expect(item.priority).toBe("HIGH");
  expect(item.status).toBe("NEW");

  // repeated — всегда массив: пустой результат даёт пустой массив, а не null.
  const page = await workItemsGrpc.searchWorkItems({
    status: "CANCELLED",
    priority: "HIGH",
    limit: 3,
  });
  expect(Array.isArray(page.items)).toBe(true);

  const empty = await workItemsGrpc.searchWorkItems({
    ownerId: "00000000-0000-4000-8000-000000000000",
  });
  expect(empty.items).toEqual([]);
  expect(empty.total).toBe(0);

  // nested message: ответ перехода содержит вложенный WorkItem.
  const transitioned = await workItemsGrpc.transitionWorkItem({
    id: created.id,
    targetStatus: "IN_PROGRESS",
    expectedVersion: created.version,
  });
  expect(transitioned.item?.status).toBe("IN_PROGRESS");
  expect(transitioned.item?.version).toBe(created.version + 1);

  // proto3 подставляет значение по умолчанию вместо отсутствующего поля:
  // незаполненная строка приходит пустой, а не как null.
  expect(typeof transitioned.item?.creatorTestId).toBe("string");
});
