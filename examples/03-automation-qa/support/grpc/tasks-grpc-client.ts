import { Metadata, type CallOptions } from "@grpc/grpc-js";
import type { CreateTaskRequest } from "../../generated/grpc/qa/tasks/v1/CreateTaskRequest.js";
import type { Task__Output } from "../../generated/grpc/qa/tasks/v1/Task.js";
import type { TaskServiceClient } from "../../generated/grpc/qa/tasks/v1/TaskService.js";
import { callUnary } from "./local-grpc.js";

export class TasksGrpcClient {
  constructor(private readonly client: TaskServiceClient) {}

  create(
    request: CreateTaskRequest,
    metadata = new Metadata(),
    options: CallOptions = {},
  ): Promise<Task__Output> {
    return callUnary((callback) =>
      this.client.createTask(request, metadata, options, callback));
  }

  get(id: string, options: CallOptions = {}): Promise<Task__Output> {
    return callUnary((callback) => this.client.getTask({ id }, options, callback));
  }
}
