import { callUnary, deadlineAfter, metadataFor, type CallContext } from "./call.js";
import type { WorkItemServiceClient } from "./generated-boundary.js";
import type { GrpcResult, GrpcWorkItem, GrpcWorkItemStatus } from "./types.js";

type RawWorkItem = Readonly<{
  id?: string;
  title?: string;
  status?: string;
  version?: number;
}>;

/**
 * Проверка формы ответа: сгенерированные типы описывают контракт, но не
 * доказывают, что пришло именно это. Граница та же, что у слоя REST.
 */
function readWorkItem(raw: unknown): GrpcWorkItem {
  const item = (raw ?? {}) as RawWorkItem;

  if (typeof item.id !== "string" || item.id === "") {
    throw new Error("Ответ gRPC не содержит поля id");
  }

  if (typeof item.title !== "string") {
    throw new Error("Ответ gRPC не содержит поля title");
  }

  if (typeof item.version !== "number") {
    throw new Error("Ответ gRPC не содержит поля version");
  }

  return Object.freeze({
    id: item.id,
    title: item.title,
    status: (item.status ?? "WORK_ITEM_STATUS_UNSPECIFIED") as GrpcWorkItemStatus,
    version: item.version,
  });
}

/** Клиент предметной области поверх сгенерированного. */
export class WorkItemsGrpcClient {
  readonly #client: WorkItemServiceClient;
  readonly #context: CallContext;

  constructor(client: WorkItemServiceClient, context: CallContext) {
    this.#client = client;
    this.#context = context;
  }

  async getById(id: string): Promise<GrpcResult<GrpcWorkItem>> {
    const result = await callUnary<unknown>((callback) =>
      this.#client.GetWorkItem(
        { id },
        metadataFor(this.#context),
        deadlineAfter(this.#context.deadlineMs),
        callback,
      ),
    );

    return result.ok ? { ok: true, value: readWorkItem(result.value) } : result;
  }

  async transition(
    id: string,
    targetStatus: GrpcWorkItemStatus,
    expectedVersion: number,
  ): Promise<GrpcResult<GrpcWorkItem>> {
    const result = await callUnary<{ item?: unknown }>((callback) =>
      this.#client.TransitionWorkItem(
        { id, targetStatus, expectedVersion },
        metadataFor(this.#context),
        deadlineAfter(this.#context.deadlineMs),
        callback,
      ),
    );

    // Ответ перехода оборачивает запись в поле item — это часть контракта.
    return result.ok
      ? { ok: true, value: readWorkItem(result.value.item) }
      : result;
  }

  /** Отдельный вызов с укороченным сроком: нужен для проверки границы времени. */
  async getByIdWithDeadline(
    id: string,
    deadlineMs: number,
  ): Promise<GrpcResult<GrpcWorkItem>> {
    const result = await callUnary<unknown>((callback) =>
      this.#client.GetWorkItem(
        { id },
        metadataFor(this.#context),
        deadlineAfter(deadlineMs),
        callback,
      ),
    );

    return result.ok ? { ok: true, value: readWorkItem(result.value) } : result;
  }
}
