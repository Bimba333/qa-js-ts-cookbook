import { loadDatabaseConfig } from "../config/index.js";
import { logEvent, safeErrorCode } from "../logging/logger.js";
import { resetEducationalDatabase } from "./reset-runner.js";

try {
  logEvent("reset.started");
  const result = await resetEducationalDatabase(
    loadDatabaseConfig("migration"),
  );
  logEvent("reset.completed", {
    removedWorkItems: result.removedWorkItems,
    removedUsers: result.removedUsers,
  });
} catch (error) {
  logEvent("reset.failed", {
    errorCode: safeErrorCode(error),
  });
  process.exitCode = 1;
}
