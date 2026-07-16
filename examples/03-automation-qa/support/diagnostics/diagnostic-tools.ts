export type LogLevel = "debug" | "info" | "warn" | "error";

export interface DiagnosticEvent {
  readonly level: LogLevel;
  readonly event: string;
  readonly correlationId: string;
  readonly occurredAt: string;
  readonly fields: Readonly<Record<string, string | number | boolean>>;
}

export interface ErrorDescription {
  readonly name: string;
  readonly message: string;
  readonly stack?: string;
  readonly cause?: ErrorDescription;
}

const sensitiveKeyFragments = [
  "apikey",
  "authorization",
  "connectionstring",
  "cookie",
  "password",
  "secret",
  "storagestate",
  "token",
] as const;

function isSensitiveKey(key: string): boolean {
  const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, "");
  return sensitiveKeyFragments.some((fragment) => normalized.includes(fragment));
}

function normalizeTimestamp(value: string): string {
  const timestamp = new Date(value);
  if (Number.isNaN(timestamp.getTime())) {
    throw new Error("occurredAt должен содержать корректную дату");
  }
  return timestamp.toISOString();
}

export function redactFields(
  fields: Readonly<Record<string, string | number | boolean>>,
): Readonly<Record<string, string | number | boolean>> {
  return Object.freeze(Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [
      key,
      isSensitiveKey(key) ? "[REDACTED]" : value,
    ]),
  ));
}

export function createDiagnosticEvent(
  level: LogLevel,
  event: string,
  correlationId: string,
  occurredAt: string,
  fields: Readonly<Record<string, string | number | boolean>> = {},
): DiagnosticEvent {
  return Object.freeze({
    level,
    event,
    correlationId,
    occurredAt: normalizeTimestamp(occurredAt),
    fields: redactFields(fields),
  });
}

function describeErrorInternal(
  error: unknown,
  seen: Set<Error>,
  depth: number,
): ErrorDescription {
  if (!(error instanceof Error)) {
    return Object.freeze({ name: "UnknownThrownValue", message: String(error) });
  }
  if (seen.has(error)) {
    return Object.freeze({ name: "CircularErrorCause", message: "[Circular cause]" });
  }
  seen.add(error);

  const description: {
    name: string;
    message: string;
    stack?: string;
    cause?: ErrorDescription;
  } = {
    name: error.name,
    message: error.message,
  };
  if (error.stack) {
    description.stack = error.stack
      .replaceAll(process.cwd(), "<repo>")
      .split("\n")
      .slice(0, 8)
      .join("\n");
  }
  if (error.cause !== undefined) {
    description.cause = depth >= 4
      ? Object.freeze({ name: "CauseDepthLimit", message: "[Cause depth limit]" })
      : describeErrorInternal(error.cause, seen, depth + 1);
  }
  return Object.freeze(description);
}

export function describeError(error: unknown): ErrorDescription {
  return describeErrorInternal(error, new Set(), 0);
}

export function serializeDiagnostic(value: unknown, maxLength = 4096): string {
  if (!Number.isSafeInteger(maxLength) || maxLength < 128) {
    throw new Error("maxLength должен быть целым числом не меньше 128");
  }

  const seen = new WeakSet<object>();
  const serialized = JSON.stringify(value, (key, currentValue: unknown) => {
    if (isSensitiveKey(key)) {
      return "[REDACTED]";
    }
    if (typeof currentValue === "bigint") {
      return currentValue.toString();
    }
    if (typeof currentValue === "object" && currentValue !== null) {
      if (seen.has(currentValue)) {
        return "[Circular]";
      }
      seen.add(currentValue);
    }
    return currentValue;
  }) ?? "null";

  if (serialized.length <= maxLength) {
    return serialized;
  }

  const bounded = JSON.stringify({
    truncated: true,
    preview: serialized.slice(0, Math.max(0, maxLength - 48)),
  });
  return bounded.length <= maxLength ? bounded : JSON.stringify({ truncated: true });
}

export function withDiagnosticCause(message: string, cause: unknown): Error {
  return new Error(message, { cause });
}
