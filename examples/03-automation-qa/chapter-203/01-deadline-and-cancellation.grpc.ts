import { status, type ServiceError } from "@grpc/grpc-js";

import { expect, test } from "../support/sut/fixtures.js";
import {
  callUnary,
  createWorkItemsClient,
  deadlineAfter,
  expectGrpcFailure,
  metadataFor,
  type WorkItem__Output,
} from "../support/sut/grpc-client.js";

test("различает deadline и явную cancellation", async ({
  workItems,
  testerToken,
}) => {
  const created = await workItems.createOrThrow({
    title: "Deadline и cancellation",
    description: "Две разные причины незавершённого вызова",
    priority: "LOW",
  });

  const client = createWorkItemsClient();
  const metadata = metadataFor({ token: testerToken.accessToken });

  try {
    // Достаточный deadline: вызов успевает завершиться.
    const completed = await callUnary<WorkItem__Output>((callback) =>
      client.GetWorkItem(
        { id: created.id },
        metadata,
        deadlineAfter(5_000),
        callback,
      ),
    );
    expect(completed.id).toBe(created.id);

    // Истёкший deadline: решение принимает клиент, не дожидаясь сервера.
    // Момент задан в прошлом, поэтому исход не зависит от скорости машины.
    const expired = await expectGrpcFailure(
      callUnary((callback) =>
        client.GetWorkItem(
          { id: created.id },
          metadata,
          { deadline: new Date(Date.now() - 1) },
          callback,
        ),
      ),
    );
    expect(expired.code).toBe(status.DEADLINE_EXCEEDED);

    // Отмена инициирована вызывающей стороной до получения ответа.
    const cancelled = new Promise<never>((_resolve, reject) => {
      const call = client.GetWorkItem(
        { id: created.id },
        metadata,
        deadlineAfter(5_000),
        (error: ServiceError | null) => {
          if (error !== null) reject(error);
        },
      );
      call.cancel();
    });

    await expect(cancelled).rejects.toMatchObject({ code: status.CANCELLED });
  } finally {
    client.close();
  }
});
