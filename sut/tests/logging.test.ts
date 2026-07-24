import assert from "node:assert/strict";
import test from "node:test";

import { logEvent, safeErrorCode } from "../src/logging/logger.js";

test("structured logger скрывает credential-like fields", () => {
  const originalWrite = process.stdout.write;
  let output = "";

  process.stdout.write = ((chunk: string | Uint8Array) => {
    output += chunk.toString();
    return true;
  }) as typeof process.stdout.write;

  try {
    logEvent("redaction.checked", {
      password: "private-password-marker",
      connectionString: "postgres://private-marker",
      readinessState: "PASS",
    });
  } finally {
    process.stdout.write = originalWrite;
  }

  const event = JSON.parse(output) as Record<string, unknown>;
  assert.equal(event.password, "[REDACTED]");
  assert.equal(event.connectionString, "[REDACTED]");
  assert.equal(event.readinessState, "PASS");
  assert.equal(output.includes("private-password-marker"), false);
  assert.equal(output.includes("postgres://private-marker"), false);
});

test("safeErrorCode не раскрывает raw error message", () => {
  const marker = "private-error-marker";

  assert.equal(
    safeErrorCode(new Error(marker)),
    "SUT_OPERATION_FAILED",
  );
  assert.equal(safeErrorCode({ code: "23505", message: marker }), "23505");
});
