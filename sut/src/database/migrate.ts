import { loadDatabaseConfig } from "../config/index.js";
import { logEvent, safeErrorCode } from "../logging/logger.js";
import { runMigrations } from "./migration-runner.js";

try {
  logEvent("migration.started");
  const result = await runMigrations({
    config: loadDatabaseConfig("migration"),
  });
  logEvent("migration.completed", {
    migrationVersion: result.currentVersion,
    appliedCount: result.applied.length,
  });
} catch (error) {
  logEvent("migration.failed", {
    errorCode: safeErrorCode(error),
  });
  process.exitCode = 1;
}
