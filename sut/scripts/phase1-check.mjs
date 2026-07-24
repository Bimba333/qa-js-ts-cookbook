import { spawnSync } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const compose = [
  "compose",
  "--project-name",
  "educational-work-items-phase1",
  "-f",
  "sut/compose.yaml",
];
const phase1Environment = {
  ...process.env,
  SUT_MODE: "educational",
  SUT_DB_HOST: "127.0.0.1",
  SUT_DB_PORT: "55432",
  SUT_DB_NAME: "educational_work_items",
  SUT_DB_MIGRATION_USER: "sut_migrator",
  SUT_DB_MIGRATION_PASSWORD: "educational_migrator_only",
  SUT_DB_APPLICATION_USER: "sut_app",
  SUT_DB_APPLICATION_PASSWORD: "educational_app_only",
  SUT_DB_READER_USER: "sut_reader",
  SUT_DB_READER_PASSWORD: "educational_reader_only",
};

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    env: phase1Environment,
    stdio: "inherit",
    timeout: 180_000,
    killSignal: "SIGTERM",
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} exited with ${result.status}`);
  }
}

function npmRun(script) {
  run(npmCommand, ["run", script]);
}

let primaryError;

try {
  npmRun("sut:typecheck");
  npmRun("sut:db:config");
  run("docker", [...compose, "down", "--volumes", "--remove-orphans"]);
  npmRun("sut:db:up");
  npmRun("sut:migrate");
  npmRun("sut:migrate");
  npmRun("sut:seed");
  npmRun("sut:seed");
  npmRun("sut:health");
  npmRun("sut:test:db");
  npmRun("sut:reset");
  npmRun("sut:reset");
  npmRun("sut:health");
} catch (error) {
  primaryError = error;
  process.exitCode = 1;
  try {
    run("docker", [...compose, "logs", "--no-color", "postgres"]);
  } catch {
    // The primary failure remains authoritative; Compose already reports log errors.
  }
} finally {
  try {
    run("docker", [...compose, "down", "--volumes", "--remove-orphans"]);
  } catch (shutdownError) {
    process.exitCode = 1;
    primaryError = primaryError
      ? new AggregateError(
          [primaryError, shutdownError],
          "Phase 1 check and cleanup both failed",
        )
      : shutdownError;
  }
}

if (primaryError) throw primaryError;
