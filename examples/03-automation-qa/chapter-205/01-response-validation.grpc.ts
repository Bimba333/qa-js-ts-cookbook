import { status } from "@grpc/grpc-js";

import { expect, test } from "../support/sut/fixtures.js";
import { expectGrpcFailure } from "../support/sut/grpc-client.js";

test("проверяет message и отсутствие side effect после отказа", async ({
  workItems,
  workItemsGrpc,
}) => {
  const created = await workItems.createOrThrow({
    title: "Business result",
    description: "Проверка сообщения и состояния",
    priority: "LOW",
  });

  // Отказ по устаревшей версии.
  const conflict = await expectGrpcFailure(
    workItemsGrpc.transitionWorkItem({
      id: created.id,
      targetStatus: "IN_PROGRESS",
      expectedVersion: created.version + 10,
    }),
  );
  expect(conflict.code).toBe(status.FAILED_PRECONDITION);

  // Отказ не оставил следа: статус и версия прежние.
  const afterFailure = await workItemsGrpc.getWorkItem(created.id);
  expect(afterFailure.status).toBe("NEW");
  expect(afterFailure.version).toBe(created.version);

  // Успешный вызов возвращает сообщение с обновлённым состоянием.
  const transitioned = await workItemsGrpc.transitionWorkItem({
    id: created.id,
    targetStatus: "IN_PROGRESS",
    expectedVersion: created.version,
  });

  expect(transitioned.item).toMatchObject({
    id: created.id,
    title: "Business result",
    status: "IN_PROGRESS",
    version: created.version + 1,
  });

  // Изменение действительно сохранено, а не только отражено в ответе.
  const persisted = await workItemsGrpc.getWorkItem(created.id);
  expect(persisted).toEqual(transitioned.item);
});
