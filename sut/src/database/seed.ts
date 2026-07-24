import { loadDatabaseConfig } from "../config/index.js";
import { logEvent, safeErrorCode } from "../logging/logger.js";
import { applySeed } from "./seed-runner.js";

try {
  logEvent("seed.started");
  const result = await applySeed(loadDatabaseConfig("migration"));
  logEvent("seed.completed", {
    requiredUsers: result.requiredUsers,
    totalSeedUsers: result.totalSeedUsers,
  });
} catch (error) {
  logEvent("seed.failed", {
    errorCode: safeErrorCode(error),
  });
  process.exitCode = 1;
}
