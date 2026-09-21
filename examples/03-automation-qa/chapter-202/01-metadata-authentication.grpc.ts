import { status } from "@grpc/grpc-js";

import { SUT_USERS } from "../support/sut/config.js";
import { expect, test } from "../support/sut/fixtures.js";
import {
  callUnary,
  createWorkItemsClient,
  deadlineAfter,
  expectGrpcFailure,
  metadataFor,
  type WorkItem__Output,
} from "../support/sut/grpc-client.js";
import { issueToken } from "../support/sut/work-items-api.js";

test("передаёт authorization и correlation id через metadata", async ({
  request,
  workItems,
  testerToken,
}) => {
  const created = await workItems.createOrThrow({
    title: "Authorized call",
    description: "Проверка metadata",
    priority: "LOW",
  });

  const client = createWorkItemsClient();

  try {
    // Метаданные — это транспортный слой вызова: аутентификация и
    // идентификатор запроса едут рядом с сообщением, а не внутри него.
    const authorized = await callUnary<WorkItem__Output>((callback) =>
      client.GetWorkItem(
        { id: created.id },
        metadataFor({
          token: testerToken.accessToken,
          correlationId: "grpc-request-1",
        }),
        deadlineAfter(5_000),
        callback,
      ),
    );
    expect(authorized.id).toBe(created.id);

    // Без метаданных аутентификации вызов отклоняется.
    const missing = await expectGrpcFailure(
      callUnary((callback) =>
        client.GetWorkItem({ id: created.id }, deadlineAfter(5_000), callback),
      ),
    );
    expect(missing.code).toBe(status.UNAUTHENTICATED);

    const invalid = await expectGrpcFailure(
      callUnary((callback) =>
        client.GetWorkItem(
          { id: created.id },
          metadataFor({ token: "invalid-token-value-0000000000" }),
          deadlineAfter(5_000),
          callback,
        ),
      ),
    );
    expect(invalid.code).toBe(status.UNAUTHENTICATED);

    // Роль viewer аутентифицирована, но изменять данные не может.
    const viewer = await issueToken(request, SUT_USERS.viewer);
    const forbidden = await expectGrpcFailure(
      callUnary((callback) =>
        client.TransitionWorkItem(
          {
            id: created.id,
            targetStatus: "IN_PROGRESS",
            expectedVersion: created.version,
          },
          metadataFor({ token: viewer.accessToken }),
          deadlineAfter(5_000),
          callback,
        ),
      ),
    );
    expect(forbidden.code).toBe(status.PERMISSION_DENIED);
  } finally {
    client.close();
  }
});
