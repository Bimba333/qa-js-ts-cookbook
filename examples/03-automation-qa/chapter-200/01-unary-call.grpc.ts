import { expect, test } from "@playwright/test";
import type { Task__Output } from "../generated/grpc/qa/tasks/v1/Task.js";
import {
  callUnary,
  createTaskServiceClient,
  startLocalGrpcServer,
} from "../support/grpc/local-grpc.js";

test("получает один response на один unary request", async () => {
  const server = await startLocalGrpcServer();
  const client = createTaskServiceClient(server.endpoint);

  try {
    const created = await callUnary<Task__Output>((callback) =>
      client.createTask({ title: "Unary call" }, callback));
    const received = await callUnary<Task__Output>((callback) =>
      client.getTask({ id: created.id }, callback));

    expect(received).toEqual(created);
  } finally {
    client.close();
    await server.close();
  }
});
