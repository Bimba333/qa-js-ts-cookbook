import path from "node:path";

import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

import type { ProtoGrpcType } from "../../../../sut/contracts/generated/grpc/work_items.js";
import type { WorkItemServiceClient } from "../../../../sut/contracts/generated/grpc/qa/educational/workitems/v1/WorkItemService.js";

/**
 * Единственное место проекта, где встречается приведение типа.
 *
 * Загрузчик `.proto` возвращает нетипизированный объект, а генератор даёт
 * типы. Связать одно с другим можно только утверждением — поэтому граница
 * сгенерированного кода заперта в одном файле, и в остальном проекте `as`
 * не появляется.
 */
const PROTO_PATH = path.resolve(
  process.cwd(),
  "sut/contracts/proto/work_items.proto",
);

const LOADER_OPTIONS: protoLoader.Options = {
  keepCase: false,
  longs: String,
  // Перечисления приходят строками: сравнивать 'DONE' понятнее, чем 3.
  enums: String,
  defaults: true,
  oneofs: true,
};

export function createGeneratedClient(target: string): WorkItemServiceClient {
  const definition = protoLoader.loadSync(PROTO_PATH, LOADER_OPTIONS);
  const loaded = grpc.loadPackageDefinition(
    definition,
  ) as unknown as ProtoGrpcType;
  const Service = loaded.qa.educational.workitems.v1
    .WorkItemService as unknown as grpc.ServiceClientConstructor;

  return new Service(
    target,
    grpc.credentials.createInsecure(),
  ) as unknown as WorkItemServiceClient;
}

/** Ожидание готовности канала: иначе первый вызов упадёт по крайнему сроку. */
export function waitForReady(
  client: WorkItemServiceClient,
  timeoutMs: number,
): Promise<void> {
  return new Promise((resolve, reject) => {
    client.waitForReady(Date.now() + timeoutMs, (error) =>
      error === undefined ? resolve() : reject(error),
    );
  });
}

export type { WorkItemServiceClient };
