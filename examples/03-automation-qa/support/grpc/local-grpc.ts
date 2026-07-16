import {
  Metadata,
  Server,
  ServerCredentials,
  credentials,
  loadPackageDefinition,
  status,
  type CallOptions,
  type ClientUnaryCall,
  type ServiceError,
} from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import { fileURLToPath } from "node:url";
import type { ProtoGrpcType } from "../../generated/grpc/tasks.js";
import type { CreateTaskRequest__Output } from "../../generated/grpc/qa/tasks/v1/CreateTaskRequest.js";
import type { Task } from "../../generated/grpc/qa/tasks/v1/Task.js";
import type {
  TaskServiceClient,
  TaskServiceHandlers,
} from "../../generated/grpc/qa/tasks/v1/TaskService.js";

const protoPath = fileURLToPath(new URL("../../proto/tasks.proto", import.meta.url));

const packageDefinition = loadSync(protoPath, {
  arrays: true,
  defaults: true,
  enums: String,
  objects: true,
  oneofs: true,
});

const grpcPackage = loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;
const TaskService = grpcPackage.qa.tasks.v1.TaskService;

export type LocalGrpcServer = {
  endpoint: string;
  close: () => Promise<void>;
};

export type UnaryResult<Response> = {
  response: Response;
  initialMetadata: Metadata;
};

const createServiceError = (
  code: status,
  details: string,
  metadata = new Metadata(),
): ServiceError => Object.assign(new Error(details), { code, details, metadata });

const createTaskRecord = (
  id: string,
  request: CreateTaskRequest__Output,
): Task => ({
  id,
  title: request.title,
  completed: false,
  labels: [...request.labels],
  priority: request.priority,
  ...(request.description === undefined ? {} : { description: request.description }),
  owner: request.owner === null ? undefined : { ...request.owner },
});

export const startLocalGrpcServer = async (): Promise<LocalGrpcServer> => {
  const server = new Server();
  const tasks = new Map<string, Task>();
  let nextTaskId = 1;

  const createTask = (
    request: CreateTaskRequest__Output,
    callback: (error: ServiceError | null, value?: Task) => void,
  ): void => {
    if (request.title.trim() === "") {
      callback(createServiceError(status.INVALID_ARGUMENT, "title is required"));
      return;
    }

    if ([...tasks.values()].some((task) => task.title === request.title)) {
      callback(createServiceError(status.ALREADY_EXISTS, "task title already exists"));
      return;
    }

    const task = createTaskRecord(`task-${nextTaskId++}`, request);
    tasks.set(task.id ?? "", task);
    callback(null, task);
  };

  const handlers: TaskServiceHandlers = {
    CreateTask: (call, callback) => createTask(call.request, callback),

    CreateAuthorizedTask: (call, callback) => {
      const authorization = call.metadata.get("authorization")[0];

      if (authorization === undefined) {
        callback(createServiceError(status.UNAUTHENTICATED, "authorization metadata is missing"));
        return;
      }

      if (authorization === "Bearer read-token") {
        callback(createServiceError(status.PERMISSION_DENIED, "write permission is required"));
        return;
      }

      if (authorization !== "Bearer test-token") {
        callback(createServiceError(status.UNAUTHENTICATED, "token is invalid"));
        return;
      }

      const responseMetadata = new Metadata();
      const correlationId = call.metadata.get("x-correlation-id")[0];
      if (typeof correlationId === "string") {
        responseMetadata.set("x-correlation-id", correlationId);
      }
      call.sendMetadata(responseMetadata);
      createTask(call.request, callback);
    },

    GetTask: (call, callback) => {
      const task = tasks.get(call.request.id);
      task === undefined
        ? callback(createServiceError(status.NOT_FOUND, "task was not found"))
        : callback(null, task);
    },

    ListTasks: (_call, callback) => callback(null, { tasks: [...tasks.values()] }),

    SlowTask: (call, callback) => {
      if (call.request.delayMs < 0) {
        callback(createServiceError(status.INVALID_ARGUMENT, "delay_ms must be non-negative"));
        return;
      }

      const timer = setTimeout(() => {
        callback(null, {
          id: "slow-task",
          title: "Delayed task",
          completed: false,
          labels: [],
          priority: "TASK_PRIORITY_UNSPECIFIED",
        });
      }, call.request.delayMs);

      call.on("cancelled", () => clearTimeout(timer));
    },
  };

  server.addService(TaskService.service, handlers);

  const port = await new Promise<number>((resolve, reject) => {
    server.bindAsync(
      "127.0.0.1:0",
      ServerCredentials.createInsecure(),
      (error, boundPort) => error === null ? resolve(boundPort) : reject(error),
    );
  });

  let closePromise: Promise<void> | undefined;

  return {
    endpoint: `127.0.0.1:${port}`,
    close: () => {
      closePromise ??= new Promise<void>((resolve, reject) => {
        server.tryShutdown((error) => error === undefined ? resolve() : reject(error));
      });
      return closePromise;
    },
  };
};

export const createTaskServiceClient = (endpoint: string): TaskServiceClient =>
  new TaskService(endpoint, credentials.createInsecure());

export const callUnary = <Response>(
  start: (callback: (error: ServiceError | null, response?: Response) => void) => ClientUnaryCall,
): Promise<Response> => new Promise((resolve, reject) => {
  start((error, response) => {
    if (error !== null) {
      reject(error);
      return;
    }

    if (response === undefined) {
      reject(new Error("gRPC call completed without a response"));
      return;
    }

    resolve(response);
  });
});

export const callUnaryWithMetadata = <Response>(
  start: (callback: (error: ServiceError | null, response?: Response) => void) => ClientUnaryCall,
): Promise<UnaryResult<Response>> => new Promise((resolve, reject) => {
  let initialMetadata = new Metadata();
  const call = start((error, response) => {
    if (error !== null) {
      reject(error);
      return;
    }

    if (response === undefined) {
      reject(new Error("gRPC call completed without a response"));
      return;
    }

    resolve({ response, initialMetadata });
  });

  call.on("metadata", (metadata) => {
    initialMetadata = metadata;
  });
});

export const deadlineAfter = (milliseconds: number): CallOptions => ({
  deadline: new Date(Date.now() + milliseconds),
});

export const isServiceError = (error: unknown): error is ServiceError =>
  error instanceof Error
  && "code" in error
  && typeof error.code === "number"
  && "details" in error
  && typeof error.details === "string";
