import { loadDatabaseConfig } from "./config/index.js";
import { checkPhase1Readiness } from "./health/readiness.js";
import { HealthServer } from "./health/server.js";
import { installShutdownHandlers } from "./lifecycle/shutdown.js";
import { logEvent, safeErrorCode } from "./logging/logger.js";

let server: HealthServer | undefined;
let removeHandlers: () => void = () => {};

try {
  const databaseConfig = loadDatabaseConfig("reader");
  server = new HealthServer({
    readiness: () => checkPhase1Readiness(databaseConfig),
  });
  const port = await server.start();
  removeHandlers = installShutdownHandlers(async () => {
    await server?.close();
    removeHandlers();
  });

  logEvent("health.started", {
    host: "127.0.0.1",
    port,
    capability: "phase1-health-only",
  });
} catch (error) {
  removeHandlers();
  try {
    await server?.close();
  } catch {
    // Startup failure remains authoritative; close failure is safely classified.
  }
  logEvent("health.startup.failed", {
    errorCode: safeErrorCode(error),
  });
  process.exitCode = 1;
}
