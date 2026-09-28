/** Контракты gRPC-слоя в терминах предметной области проекта. */
export const grpcStatuses = [
  "NEW",
  "IN_PROGRESS",
  "DONE",
  "CANCELLED",
] as const;

export type GrpcWorkItemStatus = (typeof grpcStatuses)[number];

export type GrpcWorkItem = Readonly<{
  id: string;
  title: string;
  status: GrpcWorkItemStatus;
  version: number;
}>;

/**
 * Отказ gRPC несёт числовой код, имя кода и метаданные.
 *
 * Имя нужно в сообщениях: `5` читателю ничего не говорит, `NOT_FOUND` —
 * говорит. Метаданные сохраняются отдельно, потому что сервис прикладывает
 * к отказу диагностический заголовок.
 */
export type GrpcFailure = Readonly<{
  code: number;
  codeName: string;
  details: string;
  correlationId: string | null;
}>;

export type GrpcResult<Value> =
  | Readonly<{ ok: true; value: Value }>
  | Readonly<{ ok: false; failure: GrpcFailure }>;
