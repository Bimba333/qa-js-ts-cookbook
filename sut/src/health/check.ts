import { loadDatabaseConfig } from "../config/index.js";
import { logEvent, safeErrorCode } from "../logging/logger.js";
import { checkSutReadiness } from "./readiness.js";

try {
  const result = await checkSutReadiness(
    loadDatabaseConfig("reader"),
  );
  logEvent("readiness.checked", {
    readinessState: result.status,
    database: result.checks.find((check) => check.name === "database")?.status ??
      "BLOCKED",
    migrations:
      result.checks.find((check) => check.name === "migrations")?.status ??
      "BLOCKED",
    seed: result.checks.find((check) => check.name === "seed")?.status ??
      "BLOCKED",
  });

  if (result.status !== "PASS") process.exitCode = 1;
} catch (error) {
  logEvent("readiness.failed", {
    errorCode: safeErrorCode(error),
  });
  process.exitCode = 1;
}
