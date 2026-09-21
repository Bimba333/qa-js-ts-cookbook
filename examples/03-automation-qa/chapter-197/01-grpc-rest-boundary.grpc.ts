import { expect, test } from "../support/sut/fixtures.js";

test("вызывает RPC method без подмены его HTTP-проверкой", async ({
  workItems,
  workItemsGrpc,
}) => {
  // Подготовка идёт через REST: создание записи — операция HTTP-границы.
  const created = await workItems.createOrThrow({
    title: "Проверить gRPC boundary",
    description: "Одна предметная область, два транспорта",
    priority: "MEDIUM",
  });

  // Проверка идёт через gRPC: вызывается именно RPC-метод, а не HTTP-эндпоинт.
  // Успешный REST-ответ не доказывает, что работает gRPC-граница.
  const received = await workItemsGrpc.getWorkItem(created.id);

  expect(received.id).toBe(created.id);
  expect(received.title).toBe("Проверить gRPC boundary");
  expect(received.status).toBe("NEW");
  expect(received.version).toBe(1);
});
