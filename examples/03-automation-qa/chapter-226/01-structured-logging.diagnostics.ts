import { expect, test } from "@playwright/test";
import {
  createDiagnosticEvent,
  describeError,
  serializeDiagnostic,
} from "../support/diagnostics/diagnostic-tools.js";

test("создаёт структурированное событие и маскирует секрет", async () => {
  const event = createDiagnosticEvent(
    "info",
    "api.request.completed",
    "run-226",
    "2026-07-16T09:00:00.000Z",
    {
      method: "POST",
      path: "/tasks",
      status: 201,
      apiToken: "test-only-token",
      connectionString: "postgres://test-only",
    },
  );

  expect(event).toEqual({
    level: "info",
    event: "api.request.completed",
    correlationId: "run-226",
    occurredAt: "2026-07-16T09:00:00.000Z",
    fields: {
      method: "POST",
      path: "/tasks",
      status: 201,
      apiToken: "[REDACTED]",
      connectionString: "[REDACTED]",
    },
  });
  expect(JSON.stringify(event)).not.toContain("test-only-token");

  const circular: { token: string; self?: unknown } = { token: "nested-secret" };
  circular.self = circular;
  const serialized = serializeDiagnostic(circular, 256);
  expect(serialized).toContain("[Circular]");
  expect(serialized).not.toContain("nested-secret");
  expect(() => JSON.parse(serialized)).not.toThrow();

  const bounded = serializeDiagnostic({ payload: "x".repeat(1000) }, 128);
  expect(bounded.length).toBeLessThanOrEqual(128);
  expect(JSON.parse(bounded)).toEqual(expect.objectContaining({ truncated: true }));

  expect(describeError("plain failure")).toEqual({
    name: "UnknownThrownValue",
    message: "plain failure",
  });
});
