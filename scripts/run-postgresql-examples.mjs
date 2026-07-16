import { randomUUID } from "node:crypto";
import { spawn, spawnSync } from "node:child_process";

const containerName = `qa-book-postgresql-${randomUUID()}`;
let containerStarted = false;
let child;

const docker = (...args) => {
  const result = spawnSync("docker", args, { encoding: "utf8" });
  if (result.error !== undefined) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || `docker ${args.join(" ")} failed`);
  }
  return result.stdout.trim();
};

const cleanup = () => {
  if (containerStarted) {
    const result = spawnSync("docker", ["rm", "-f", "-v", containerName], {
      encoding: "utf8",
    });
    containerStarted = false;
    if (result.error !== undefined) {
      throw result.error;
    }
    if (result.status !== 0 && !result.stderr.includes("No such container")) {
      throw new Error(result.stderr.trim() || `Cannot remove ${containerName}`);
    }
  }
};

const handleSignal = (signal, exitCode) => {
  child?.kill(signal);
  try {
    cleanup();
  } catch (error) {
    console.error(error);
  }
  process.exit(exitCode);
};

process.once("SIGINT", () => handleSignal("SIGINT", 130));
process.once("SIGTERM", () => handleSignal("SIGTERM", 143));

let runnerError;
try {
  docker(
    "run", "--rm", "--detach",
    "--name", containerName,
    "--publish", "127.0.0.1::5432",
    "--mount", "type=tmpfs,destination=/var/lib/postgresql/data",
    "--env", "POSTGRES_DB=qa_book_test",
    "--env", "POSTGRES_USER=qa_user",
    "--env", "POSTGRES_PASSWORD=qa_password",
    "postgres:15",
  );
  containerStarted = true;

  let ready = false;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const result = spawnSync(
      "docker",
      ["exec", containerName, "pg_isready", "-U", "qa_user", "-d", "qa_book_test"],
      { stdio: "ignore" },
    );
    if (result.error !== undefined) {
      throw result.error;
    }
    if (result.status === 0) {
      ready = true;
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  if (!ready) {
    const logs = spawnSync("docker", ["logs", "--tail", "40", containerName], {
      encoding: "utf8",
    });
    const diagnostics = logs.error === undefined
      ? `${logs.stderr}${logs.stdout}`
      : logs.error.message;
    throw new Error(
      `Local PostgreSQL did not become ready within 15 seconds.\n${diagnostics}`,
    );
  }

  const portOutput = docker("port", containerName, "5432/tcp");
  const port = portOutput.match(/127\.0\.0\.1:(\d+)/)?.[1];
  if (port === undefined) {
    throw new Error(`Cannot determine loopback PostgreSQL port: ${portOutput}`);
  }

  child = spawn(
    "npx",
    [
      "playwright",
      "test",
      "--config=examples/03-automation-qa/playwright.postgresql.config.ts",
      ...process.argv.slice(2),
    ],
    {
      stdio: "inherit",
      env: {
        ...process.env,
        PGHOST: "127.0.0.1",
        PGPORT: port,
        PGUSER: "qa_user",
        PGPASSWORD: "qa_password",
        PGDATABASE: "qa_book_test",
      },
    },
  );

  const exitCode = await new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("close", (code) => resolve(code));
  });
  process.exitCode = typeof exitCode === "number" ? exitCode : 1;
} catch (error) {
  runnerError = error;
} finally {
  try {
    cleanup();
  } catch (cleanupError) {
    runnerError = runnerError === undefined
      ? cleanupError
      : new AggregateError(
        [runnerError, cleanupError],
        "PostgreSQL runner and container cleanup both failed",
      );
  }
}

if (runnerError !== undefined) {
  throw runnerError;
}
