import * as grpc from "@grpc/grpc-js";

import type { GrpcFailure, GrpcResult } from "./types.js";

export type CallContext = Readonly<{
  token: string;
  correlationId: string;
  deadlineMs: number;
}>;

/** Метаданные создаются заново на каждый вызов: общий объект связал бы тесты. */
export function metadataFor(context: CallContext): grpc.Metadata {
  const metadata = new grpc.Metadata();

  metadata.set("authorization", `Bearer ${context.token}`);
  metadata.set("correlation-id", context.correlationId);

  return metadata;
}

/** Крайний срок — абсолютный момент, а не длительность. */
export function deadlineAfter(milliseconds: number): grpc.CallOptions {
  return { deadline: new Date(Date.now() + milliseconds) };
}

function readCorrelationId(metadata: grpc.Metadata | undefined): string | null {
  const value = metadata?.get("correlation-id")[0];

  return typeof value === "string" ? value : null;
}

export function toFailure(error: grpc.ServiceError): GrpcFailure {
  return Object.freeze({
    code: error.code,
    // Имя кода читается в отчёте, число — нет.
    codeName: grpc.status[error.code] ?? "UNKNOWN",
    details: error.details,
    correlationId: readCorrelationId(error.metadata),
  });
}

/**
 * Унарный вызов как результат, а не как исключение.
 *
 * Причина та же, что в слое REST: отказ — предмет проверки негативного
 * сценария, и разбирать его строкой сообщения не нужно.
 */
export function callUnary<Response>(
  invoke: (callback: grpc.requestCallback<Response>) => grpc.ClientUnaryCall,
): Promise<GrpcResult<Response>> {
  return new Promise<GrpcResult<Response>>((resolve) => {
    invoke((error, response) => {
      if (error) {
        resolve({ ok: false, failure: toFailure(error) });

        return;
      }

      resolve({ ok: true, value: response as Response });
    });
  });
}

export { grpc };
