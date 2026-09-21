type SafeLogValue = boolean | number | string | null;

export type SafeLogFields = Readonly<Record<string, SafeLogValue>>;

const SENSITIVE_FIELD =
  /(?:password|secret|token|authorization|cookie|salt|hash|connectionString)/i;

export function logEvent(event: string, fields: SafeLogFields = {}): void {
  const safeFields = Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [
      key,
      SENSITIVE_FIELD.test(key) ? "[REDACTED]" : value,
    ]),
  );

  process.stdout.write(
    `${JSON.stringify({
      timestamp: new Date().toISOString(),
      component: "educational-work-items-sut",
      event,
      ...safeFields,
    })}\n`,
  );
}

export function safeErrorCode(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string" &&
    /^[A-Za-z0-9_]{1,40}$/.test(error.code)
  ) {
    return error.code;
  }

  return "SUT_OPERATION_FAILED";
}
