import { expect, test } from "../support/sut/fixtures.js";
import {
  callUnary,
  createWorkItemsClient,
  deadlineAfter,
  metadataFor,
  type GetWorkItemRequest,
  type WorkItem__Output,
} from "../support/sut/grpc-client.js";

test("создаёт client из сгенерированного service API", async ({
  workItems,
  testerToken,
}) => {
  const created = await workItems.createOrThrow({
    title: "Generated client",
    description: "Проверка сгенерированного клиента",
    priority: "LOW",
  });

  // Runtime stub собирается из .proto, а типы приходят из генератора.
  // Ошибка в имени поля станет ошибкой компиляции, а не отказом в рантайме.
  const client = createWorkItemsClient();
  const request: GetWorkItemRequest = { id: created.id };

  try {
    await new Promise<void>((resolve, reject) => {
      client.waitForReady(Date.now() + 2_000, (error) =>
        error === undefined ? resolve() : reject(error),
      );
    });

    const item = await callUnary<WorkItem__Output>((callback) =>
      client.GetWorkItem(
        request,
        metadataFor({ token: testerToken.accessToken }),
        deadlineAfter(5_000),
        callback,
      ),
    );

    expect(item.id).toBe(created.id);
    expect(item.title).toBe("Generated client");
  } finally {
    client.close();
  }
});
