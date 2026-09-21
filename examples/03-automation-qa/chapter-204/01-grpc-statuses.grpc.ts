import { status } from "@grpc/grpc-js";

import { expect, test } from "../support/sut/fixtures.js";
import { expectGrpcFailure } from "../support/sut/grpc-client.js";

test("проверяет gRPC status и details негативного ответа", async ({
  workItems,
  workItemsGrpc,
}) => {
  // Некорректный аргумент: идентификатор не является UUID.
  const invalidArgument = await expectGrpcFailure(
    workItemsGrpc.getWorkItem("not-a-uuid"),
  );
  expect(invalidArgument.code).toBe(status.INVALID_ARGUMENT);
  expect(invalidArgument.details).toContain("UUID");

  // Корректный аргумент, но записи нет.
  const notFound = await expectGrpcFailure(
    workItemsGrpc.getWorkItem("00000000-0000-4000-8000-000000000000"),
  );
  expect(notFound.code).toBe(status.NOT_FOUND);

  // Нарушено предусловие домена: переход из NEW сразу в DONE не разрешён.
  const created = await workItems.createOrThrow({
    title: "Недопустимый переход",
    description: "Проверка FAILED_PRECONDITION",
    priority: "LOW",
  });

  const precondition = await expectGrpcFailure(
    workItemsGrpc.transitionWorkItem({
      id: created.id,
      targetStatus: "DONE",
      expectedVersion: created.version,
    }),
  );
  expect(precondition.code).toBe(status.FAILED_PRECONDITION);

  // INTERNAL не используется для известных отказов: он означал бы сбой.
  for (const error of [invalidArgument, notFound, precondition]) {
    expect(error.code).not.toBe(status.INTERNAL);
  }
});
