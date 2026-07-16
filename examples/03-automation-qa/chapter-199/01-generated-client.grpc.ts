import { expect, test } from "@playwright/test";
import type { CreateTaskRequest } from "../generated/grpc/qa/tasks/v1/CreateTaskRequest.js";
import type { Task__Output } from "../generated/grpc/qa/tasks/v1/Task.js";
import {
  callUnary,
  createTaskServiceClient,
  startLocalGrpcServer,
} from "../support/grpc/local-grpc.js";

test("создаёт client из сгенерированного service API", async () => {
  const server = await startLocalGrpcServer();
  const client = createTaskServiceClient(server.endpoint);
  const request: CreateTaskRequest = { title: "Generated client" };

  try {
    await new Promise<void>((resolve, reject) => {
      client.waitForReady(Date.now() + 1_000, (error) =>
        error === undefined ? resolve() : reject(error));
    });

    const task = await callUnary<Task__Output>((callback) => client.createTask(request, callback));
    expect(task.id).toBe("task-1");
  } finally {
    client.close();
    await server.close();
  }
});
