import { expect, test as base } from "@playwright/test";
import type { TasksGrpcClient } from "../support/grpc/tasks-grpc-client.js";
import {
  createTaskServiceClient,
  startLocalGrpcServer,
} from "../support/grpc/local-grpc.js";
import { TasksGrpcClient as TasksClient } from "../support/grpc/tasks-grpc-client.js";

type GrpcFixtures = {
  tasksGrpc: TasksGrpcClient;
};

const test = base.extend<GrpcFixtures>({
  tasksGrpc: async ({}, use) => {
    const server = await startLocalGrpcServer();
    const rawClient = createTaskServiceClient(server.endpoint);

    try {
      await use(new TasksClient(rawClient));
    } finally {
      rawClient.close();
      await server.close();
    }
  },
});

test("предоставляет domain client через fixture", async ({ tasksGrpc }) => {
  const created = await tasksGrpc.create({ title: "Framework boundary" });
  const received = await tasksGrpc.get(created.id);

  expect(received).toEqual(created);
});
