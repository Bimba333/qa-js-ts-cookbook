import { status, type ServiceError } from "@grpc/grpc-js";
import { expect, test } from "@playwright/test";
import type { Task__Output } from "../generated/grpc/qa/tasks/v1/Task.js";
import {
  callUnary,
  createTaskServiceClient,
  deadlineAfter,
  startLocalGrpcServer,
} from "../support/grpc/local-grpc.js";

test("различает deadline и явную cancellation", async () => {
  const server = await startLocalGrpcServer();
  const client = createTaskServiceClient(server.endpoint);

  try {
    const completed = await callUnary<Task__Output>((callback) =>
      client.slowTask({ delayMs: 5 }, deadlineAfter(500), callback));
    expect(completed.id).toBe("slow-task");

    await expect(callUnary((callback) =>
      client.slowTask({ delayMs: 100 }, deadlineAfter(10), callback)))
      .rejects.toMatchObject({ code: status.DEADLINE_EXCEEDED });

    const cancelled = new Promise<never>((_resolve, reject) => {
      const call = client.slowTask({ delayMs: 100 }, (error: ServiceError | null) => {
        if (error !== null) reject(error);
      });
      call.cancel();
    });
    await expect(cancelled).rejects.toMatchObject({ code: status.CANCELLED });
  } finally {
    client.close();
    await server.close();
  }
});
