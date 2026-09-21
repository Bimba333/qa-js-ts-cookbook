/**
 * Доменные ошибки с устойчивыми кодами.
 *
 * Код — часть публичного контракта: транспорт переводит его в HTTP status или
 * gRPC status, но не придумывает собственную классификацию. Сообщение
 * безопасно для показа клиенту и никогда не содержит SQL, credential material
 * или детали реализации.
 */
export type DomainErrorCode =
  | "VALIDATION_FAILED"
  | "PAYLOAD_TOO_LARGE"
  | "UNAUTHENTICATED"
  | "PERMISSION_DENIED"
  | "NOT_FOUND"
  | "VERSION_CONFLICT"
  | "INVALID_TRANSITION"
  | "SEED_IMMUTABLE"
  | "CROSS_RUN_CLEANUP_DENIED";

export class DomainError extends Error {
  readonly code: DomainErrorCode;
  readonly field: string | undefined;

  constructor(code: DomainErrorCode, message: string, field?: string) {
    super(message);
    this.name = "DomainError";
    this.code = code;
    this.field = field;
  }
}

export function isDomainError(error: unknown): error is DomainError {
  return error instanceof DomainError;
}

export function validationError(field: string, message: string): DomainError {
  return new DomainError("VALIDATION_FAILED", message, field);
}
