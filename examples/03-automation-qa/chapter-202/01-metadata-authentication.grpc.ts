import { Metadata, status } from "@grpc/grpc-js";
import { expect, test } from "@playwright/test";
import type { Task__Output } from "../generated/grpc/qa/tasks/v1/Task.js";
import {
  callUnary,
  callUnaryWithMetadata,
  createTaskServiceClient,
  startLocalGrpcServer,
} from "../support/grpc/local-grpc.js";

test("передаёт authorization и correlation id через metadata", async () => {
  const server = await startLocalGrpcServer();
  const client = createTaskServiceClient(server.endpoint);
  const validMetadata = new Metadata();
  validMetadata.set("authorization", "Bearer test-token");
  validMetadata.set("x-correlation-id", "grpc-request-1");

  try {
    const valid = await callUnaryWithMetadata<Task__Output>((callback) =>
      client.createAuthorizedTask({ title: "Authorized task" }, validMetadata, callback));
    expect(valid.response.id).toBe("task-1");
    expect(valid.initialMetadata.get("x-correlation-id")).toEqual(["grpc-request-1"]);

    await expect(callUnary<Task__Output>((callback) =>
      client.createAuthorizedTask({ title: "Missing token" }, callback)))
      .rejects.toMatchObject({ code: status.UNAUTHENTICATED });

    const invalidMetadata = new Metadata();
    invalidMetadata.set("authorization", "Bearer invalid-token");
    await expect(callUnary<Task__Output>((callback) =>
      client.createAuthorizedTask({ title: "Invalid token" }, invalidMetadata, callback)))
      .rejects.toMatchObject({ code: status.UNAUTHENTICATED });

    const readOnlyMetadata = new Metadata();
    readOnlyMetadata.set("authorization", "Bearer read-token");
    await expect(callUnary<Task__Output>((callback) =>
      client.createAuthorizedTask({ title: "Forbidden task" }, readOnlyMetadata, callback)))
      .rejects.toMatchObject({ code: status.PERMISSION_DENIED });
  } finally {
    client.close();
    await server.close();
  }
});
