import { callUnary, deadlineAfter, metadataFor, type CallContext } from "./call.js";
import type { WorkItemServiceClient } from "./generated-boundary.js";
import type { GrpcResult } from "./types.js";

/**
 * Чтение без приведения к модели слоя.
 *
 * Межслойное сравнение нормализует ответ само, поэтому ему нужен полный
 * ответ, а не усечённая модель `GrpcWorkItem`.
 */
export function readRawWorkItem(
  client: WorkItemServiceClient,
  context: CallContext,
  id: string,
): Promise<GrpcResult<unknown>> {
  return callUnary<unknown>((callback) =>
    client.GetWorkItem(
      { id },
      metadataFor(context),
      deadlineAfter(context.deadlineMs),
      callback,
    ),
  );
}
