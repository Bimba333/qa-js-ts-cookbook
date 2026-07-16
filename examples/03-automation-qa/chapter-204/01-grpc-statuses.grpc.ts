import { status } from "@grpc/grpc-js";
import { expect, test } from "@playwright/test";
import {
  callUnary,
  createTaskServiceClient,
  startLocalGrpcServer,
} from "../support/grpc/local-grpc.js";

test("проверяет gRPC status и details негативного ответа", async () => {
  const server = await startLocalGrpcServer();
  const client = createTaskServiceClient(server.endpoint);

  try {
    await expect(callUnary((callback) => client.createTask({ title: "" }, callback)))
      .rejects.toMatchObject({
        code: status.INVALID_ARGUMENT,
        details: "title is required",
      });

    await expect(callUnary((callback) => client.getTask({ id: "missing" }, callback)))
      .rejects.toMatchObject({ code: status.NOT_FOUND, details: "task was not found" });
  } finally {
    client.close();
    await server.close();
  }
});
