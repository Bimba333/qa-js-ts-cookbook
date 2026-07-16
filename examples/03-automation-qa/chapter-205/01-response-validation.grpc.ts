import { status } from "@grpc/grpc-js";
import { expect, test } from "@playwright/test";
import type { ListTasksResponse__Output } from "../generated/grpc/qa/tasks/v1/ListTasksResponse.js";
import type { Task__Output } from "../generated/grpc/qa/tasks/v1/Task.js";
import {
  callUnary,
  createTaskServiceClient,
  startLocalGrpcServer,
} from "../support/grpc/local-grpc.js";

test("проверяет message и отсутствие side effect после отказа", async () => {
  const server = await startLocalGrpcServer();
  const client = createTaskServiceClient(server.endpoint);

  try {
    await expect(callUnary((callback) => client.createTask({ title: "" }, callback)))
      .rejects.toMatchObject({
        code: status.INVALID_ARGUMENT,
        details: "title is required",
      });
    const afterFailure = await callUnary<ListTasksResponse__Output>((callback) =>
      client.listTasks({}, callback));
    expect(afterFailure.tasks).toEqual([]);

    const created = await callUnary<Task__Output>((callback) => client.createTask({
      title: "Business result",
      labels: ["qa"],
      priority: "TASK_PRIORITY_LOW",
    }, callback));
    expect(created).toMatchObject({
      id: "task-1",
      title: "Business result",
      completed: false,
      labels: ["qa"],
      priority: "TASK_PRIORITY_LOW",
    });

    const persisted = await callUnary<Task__Output>((callback) =>
      client.getTask({ id: created.id }, callback));
    expect(persisted).toEqual(created);
  } finally {
    client.close();
    await server.close();
  }
});
