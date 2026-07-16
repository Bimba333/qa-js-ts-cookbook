import { expect, test } from "@playwright/test";
import type { Task__Output } from "../generated/grpc/qa/tasks/v1/Task.js";
import {
  callUnary,
  createTaskServiceClient,
  startLocalGrpcServer,
} from "../support/grpc/local-grpc.js";

test("проверяет repeated, enum, optional и nested fields", async () => {
  const server = await startLocalGrpcServer();
  const client = createTaskServiceClient(server.endpoint);

  try {
    const task = await callUnary<Task__Output>((callback) => client.createTask({
      title: "Проверить поля",
      labels: ["api", "critical"],
      priority: "TASK_PRIORITY_HIGH",
      description: "Контракт полей",
      owner: { id: "user-1", name: "QA Engineer" },
    }, callback));

    expect(task.labels).toEqual(["api", "critical"]);
    expect(task.priority).toBe("TASK_PRIORITY_HIGH");
    expect(task.description).toBe("Контракт полей");
    expect(task.owner).toEqual({ id: "user-1", name: "QA Engineer" });
  } finally {
    client.close();
    await server.close();
  }
});
