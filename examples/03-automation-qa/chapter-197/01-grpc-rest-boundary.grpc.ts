import { expect, test } from "@playwright/test";
import {
  callUnary,
  createTaskServiceClient,
  startLocalGrpcServer,
} from "../support/grpc/local-grpc.js";

test("вызывает RPC method без подмены его HTTP-проверкой", async () => {
  const server = await startLocalGrpcServer();
  const client = createTaskServiceClient(server.endpoint);

  try {
    const task = await callUnary((callback) =>
      client.createTask({ title: "Проверить gRPC boundary" }, callback));

    expect(task).toMatchObject({ id: "task-1", title: "Проверить gRPC boundary" });
  } finally {
    client.close();
    await server.close();
  }
});
