import { expect, test } from "@playwright/test";
import {
  createDiagnosticEvent,
  describeError,
  serializeDiagnostic,
  withDiagnosticCause,
} from "../support/diagnostics/diagnostic-tools.js";

test("связывает доказательства одним идентификатором и сохраняет cause", async ({}, testInfo) => {
  const correlationId = "task-231-run-1";
  const event = createDiagnosticEvent(
    "error",
    "task.validation.failed",
    correlationId,
    "2026-07-16T09:01:00.000Z",
    {
      taskId: "task-231",
      authorization: "Bearer test-only-token",
    },
  );
  const cause = new Error("status pending");
  const wrapped = withDiagnosticCause("Не удалось подтвердить task-231", cause);
  const errorDetails = describeError(wrapped);

  await testInfo.attach("task-231-diagnostic-context", {
    body: serializeDiagnostic({ correlationId, event, errorDetails }),
    contentType: "application/json",
  });

  expect(errorDetails.cause).toEqual(expect.objectContaining({
    name: "Error",
    message: "status pending",
  }));
  expect(errorDetails.stack).toContain("Не удалось подтвердить task-231");
  expect(errorDetails.stack).not.toContain(process.cwd());
  expect(JSON.stringify(event)).not.toContain("test-only-token");

  const first = new Error("first cause");
  const second = new Error("second cause", { cause: first });
  first.cause = second;
  const circularCause = describeError(first);
  expect(serializeDiagnostic(circularCause)).toContain("CircularErrorCause");

  const nonErrorCause = describeError(withDiagnosticCause("wrapped value", "plain cause"));
  expect(nonErrorCause.cause).toEqual({
    name: "UnknownThrownValue",
    message: "plain cause",
  });
});
