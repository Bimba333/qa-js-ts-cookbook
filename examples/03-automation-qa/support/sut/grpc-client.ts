import path from "node:path";

import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

import type { ProtoGrpcType } from "../../../../sut/contracts/generated/grpc/work_items.js";
import type { GetWorkItemRequest } from "../../../../sut/contracts/generated/grpc/qa/educational/workitems/v1/GetWorkItemRequest.js";
import type { SearchWorkItemsRequest } from "../../../../sut/contracts/generated/grpc/qa/educational/workitems/v1/SearchWorkItemsRequest.js";
import type { SearchWorkItemsResponse__Output } from "../../../../sut/contracts/generated/grpc/qa/educational/workitems/v1/SearchWorkItemsResponse.js";
import type { TransitionWorkItemRequest } from "../../../../sut/contracts/generated/grpc/qa/educational/workitems/v1/TransitionWorkItemRequest.js";
import type { TransitionWorkItemResponse__Output } from "../../../../sut/contracts/generated/grpc/qa/educational/workitems/v1/TransitionWorkItemResponse.js";
import type { WorkItem__Output } from "../../../../sut/contracts/generated/grpc/qa/educational/workitems/v1/WorkItem.js";
import type { WorkItemServiceClient } from "../../../../sut/contracts/generated/grpc/qa/educational/workitems/v1/WorkItemService.js";

import { sutConfig } from "./config.js";

// Типы контракта переэкспортируются, чтобы примеры импортировали их из
// одного места и не зависели от расположения сгенерированного кода.
export type {
  GetWorkItemRequest,
  SearchWorkItemsRequest,
  SearchWorkItemsResponse__Output,
  TransitionWorkItemRequest,
  TransitionWorkItemResponse__Output,
  WorkItem__Output,
  WorkItemServiceClient,
};

/**
 * Контракт берётся из `sut/contracts/proto` — это публичная граница стенда.
 *
 * Типы сгенерированы из того же файла (`npm run sut:grpc:generate`), поэтому
 * расхождение контракта и клиента обнаружится при проверке типов, а не в виде
 * непонятного отказа во время выполнения.
 */
const PROTO_PATH = path.resolve(
  process.cwd(),
  "sut/contracts/proto/work_items.proto",
);

export type CallContext = Readonly<{
  token: string;
  correlationId?: string;
  creatorTestId?: string;
  deadlineMs?: number;
}>;

function loadServiceConstructor(): grpc.ServiceClientConstructor {
  const definition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: false,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  const loaded = grpc.loadPackageDefinition(
    definition,
  ) as unknown as ProtoGrpcType;

  return loaded.qa.educational.workitems.v1
    .WorkItemService as unknown as grpc.ServiceClientConstructor;
}

export function createWorkItemsClient(
  target = sutConfig().grpcTarget,
): WorkItemServiceClient {
  const Service = loadServiceConstructor();

  return new Service(
    target,
    grpc.credentials.createInsecure(),
  ) as unknown as WorkItemServiceClient;
}

export function metadataFor(context: CallContext): grpc.Metadata {
  const metadata = new grpc.Metadata();
  metadata.set("authorization", `Bearer ${context.token}`);
  metadata.set("correlation-id", context.correlationId ?? "example-call");

  if (context.creatorTestId !== undefined) {
    metadata.set("creator-test-id", context.creatorTestId);
  }

  return metadata;
}

/** Граница времени задаётся клиентом всегда: зависший сервер не должен вешать тест. */
export function deadlineAfter(milliseconds: number): grpc.CallOptions {
  return { deadline: new Date(Date.now() + milliseconds) };
}

export function callUnary<Response>(
  invoke: (callback: grpc.requestCallback<Response>) => grpc.ClientUnaryCall,
): Promise<Response> {
  return new Promise<Response>((resolve, reject) => {
    invoke((error, response) => {
      if (error) reject(error);
      else resolve(response as Response);
    });
  });
}

/**
 * Клиент предметной области поверх сгенерированного stub.
 *
 * Тест вызывает операции домена, а метаданные, deadline и разбор callback
 * остаются внутри адаптера.
 */
export class WorkItemsGrpcClient {
  readonly #client: WorkItemServiceClient;
  readonly #context: CallContext;

  constructor(client: WorkItemServiceClient, context: CallContext) {
    this.#client = client;
    this.#context = context;
  }

  #options(): grpc.CallOptions {
    return deadlineAfter(this.#context.deadlineMs ?? 5_000);
  }

  getWorkItem(id: string): Promise<WorkItem__Output> {
    return callUnary<WorkItem__Output>((callback) =>
      this.#client.GetWorkItem(
        { id },
        metadataFor(this.#context),
        this.#options(),
        callback,
      ),
    );
  }

  searchWorkItems(
    request: SearchWorkItemsRequest,
  ): Promise<SearchWorkItemsResponse__Output> {
    return callUnary<SearchWorkItemsResponse__Output>((callback) =>
      this.#client.SearchWorkItems(
        request,
        metadataFor(this.#context),
        this.#options(),
        callback,
      ),
    );
  }

  transitionWorkItem(
    request: TransitionWorkItemRequest,
  ): Promise<TransitionWorkItemResponse__Output> {
    return callUnary<TransitionWorkItemResponse__Output>((callback) =>
      this.#client.TransitionWorkItem(
        request,
        metadataFor(this.#context),
        this.#options(),
        callback,
      ),
    );
  }

  close(): void {
    this.#client.close();
  }
}

/** Возвращает ошибку отказа, если вызов неожиданно завершился успешно — падает. */
export async function expectGrpcFailure(
  operation: Promise<unknown>,
): Promise<grpc.ServiceError> {
  try {
    await operation;
  } catch (error) {
    return error as grpc.ServiceError;
  }

  throw new Error("Ожидался отказ gRPC, но вызов завершился успешно");
}
