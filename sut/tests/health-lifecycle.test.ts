import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import path from "node:path";
import test from "node:test";

import { loadDatabaseConfig } from "../src/config/index.js";
import { runMigrations } from "../src/database/migration-runner.js";
import { checkPhase1Readiness } from "../src/health/readiness.js";
import { HealthServer } from "../src/health/server.js";
import { installShutdownHandlers } from "../src/lifecycle/shutdown.js";
import {
  createTestSchema,
  dropTestSchema,
  uniqueSchema,
  withRoleClient,
} from "./support/database.js";

test("возвращает BLOCKED для недоступной database", async () => {
  const config = loadDatabaseConfig("reader", {
    SUT_MODE: "educational",
    SUT_DB_PORT: "1",
    SUT_DB_CONNECTION_TIMEOUT_MS: "100",
  });
  const result = await checkPhase1Readiness(config);

  assert.equal(result.status, "BLOCKED");
  assert.equal(
    result.checks.find((check) => check.name === "database")?.status,
    "BLOCKED",
  );
});

test("различает missing migrations и missing seed", async () => {
  const migrationConfig = loadDatabaseConfig("migration");
  const emptySchema = uniqueSchema("health_empty");
  const migratedSchema = uniqueSchema("health_migrated");
  await createTestSchema(emptySchema);
  await createTestSchema(migratedSchema);

  try {
    const withoutMigrations = await checkPhase1Readiness(
      migrationConfig,
      emptySchema,
    );
    assert.equal(withoutMigrations.status, "BLOCKED");
    assert.equal(
      withoutMigrations.checks.find((check) => check.name === "migrations")
        ?.status,
      "BLOCKED",
    );

    await runMigrations({
      config: migrationConfig,
      schema: migratedSchema,
    });
    const withoutSeed = await checkPhase1Readiness(
      migrationConfig,
      migratedSchema,
    );
    assert.equal(withoutSeed.status, "BLOCKED");
    assert.equal(
      withoutSeed.checks.find((check) => check.name === "migrations")?.status,
      "PASS",
    );
    assert.equal(
      withoutSeed.checks.find((check) => check.name === "seed")?.status,
      "BLOCKED",
    );
  } finally {
    await dropTestSchema(emptySchema);
    await dropTestSchema(migratedSchema);
  }
});

test("возвращает PASS только для полной Phase 1 foundation", async () => {
  const result = await checkPhase1Readiness(
    loadDatabaseConfig("reader"),
  );

  assert.equal(result.status, "PASS");
  assert.equal(result.capability, "phase1-foundation");
  assert.deepEqual(
    result.checks.map((check) => check.status),
    ["PASS", "PASS", "PASS"],
  );
});

test("блокирует readiness при изменённом migration name", async () => {
  const schema = uniqueSchema("health_drift");
  const migrationConfig = loadDatabaseConfig("migration");
  await createTestSchema(schema);

  try {
    await runMigrations({
      config: migrationConfig,
      schema,
    });
    await withRoleClient("migration", (client) =>
      client.query(
        `UPDATE "${schema}".schema_migrations
            SET name = 'changed-name'
          WHERE version = 1`,
      ),
    );

    const result = await checkPhase1Readiness(migrationConfig, schema);
    assert.equal(result.status, "BLOCKED");
    assert.equal(
      result.checks.find((check) => check.name === "migrations")?.status,
      "BLOCKED",
    );
  } finally {
    await dropTestSchema(schema);
  }
});

test("health server публикует только live и ready probes", async () => {
  const server = new HealthServer({
    readiness: async () => ({
      status: "PASS",
      capability: "phase1-foundation",
      checks: [],
    }),
  });
  const port = await server.start();

  try {
    const live = await fetch(`http://127.0.0.1:${port}/health/live`);
    const ready = await fetch(`http://127.0.0.1:${port}/health/ready`);
    const business = await fetch(`http://127.0.0.1:${port}/api/v1/work-items`);

    assert.equal(live.status, 200);
    assert.equal(ready.status, 200);
    assert.equal(business.status, 404);
  } finally {
    await server.close();
    await server.close();
  }
});

test("health server возвращает 503 для BLOCKED readiness", async () => {
  const server = new HealthServer({
    readiness: async () => ({
      status: "BLOCKED",
      capability: "phase1-foundation",
      checks: [
        { name: "database", status: "BLOCKED" },
      ],
    }),
  });
  const port = await server.start();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/health/ready`);
    assert.equal(response.status, 503);
  } finally {
    await server.close();
  }
});

test("health server преобразует readiness error в безопасный 503", async () => {
  const server = new HealthServer({
    readiness: async () => {
      throw new Error("internal database detail");
    },
  });
  const port = await server.start();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/health/ready`);
    const body = (await response.json()) as { status?: unknown };

    assert.equal(response.status, 503);
    assert.equal(body.status, "BLOCKED");
    assert.equal(JSON.stringify(body).includes("internal database detail"), false);
  } finally {
    await server.close();
  }
});

test("health server ограничивает время readiness callback", async () => {
  const server = new HealthServer({
    readinessTimeoutMs: 100,
    readiness: () => new Promise(() => {}),
  });
  const port = await server.start();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/health/ready`);
    const body = (await response.json()) as { status?: unknown };

    assert.equal(response.status, 503);
    assert.equal(body.status, "BLOCKED");
  } finally {
    await server.close();
  }
});

test("signal handlers вызывают один shutdown и освобождают listeners", async () => {
  const initialSigint = process.listenerCount("SIGINT");
  const initialSigterm = process.listenerCount("SIGTERM");
  let closeCount = 0;
  const dispose = installShutdownHandlers(async () => {
    closeCount += 1;
  });

  assert.equal(process.listenerCount("SIGINT"), initialSigint + 1);
  assert.equal(process.listenerCount("SIGTERM"), initialSigterm + 1);

  process.emit("SIGTERM", "SIGTERM");
  process.emit("SIGINT", "SIGINT");
  await new Promise((resolve) => setImmediate(resolve));
  dispose();

  assert.equal(closeCount, 1);
  assert.equal(process.listenerCount("SIGINT"), initialSigint);
  assert.equal(process.listenerCount("SIGTERM"), initialSigterm);
});

test("health process завершается по SIGTERM после bounded cleanup", async () => {
  const child = spawn(
    process.execPath,
    [path.resolve(process.cwd(), ".sut-build/src/main.js")],
    {
      cwd: process.cwd(),
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  let stdout = "";
  let stderr = "";
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stdout.on("data", (chunk: string) => {
    stdout += chunk;
  });
  child.stderr.on("data", (chunk: string) => {
    stderr += chunk;
  });

  const started = new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error("Health process startup timeout")),
      3_000,
    );
    const inspect = (): void => {
      if (stdout.includes('"event":"health.started"')) {
        clearTimeout(timeout);
        child.stdout.off("data", inspect);
        resolve();
      }
    };
    child.stdout.on("data", inspect);
    child.once("exit", (code, signal) => {
      clearTimeout(timeout);
      reject(
        new Error(
          `Health process exited before startup: code=${code}, signal=${signal}, stderr=${stderr}`,
        ),
      );
    });
  });

  try {
    await started;
    child.kill("SIGTERM");

    const exit = await new Promise<{
      code: number | null;
      signal: NodeJS.Signals | null;
    }>((resolve, reject) => {
      const timeout = setTimeout(() => {
        child.kill("SIGKILL");
        reject(new Error("Health process shutdown timeout"));
      }, 3_000);
      child.once("exit", (code, signal) => {
        clearTimeout(timeout);
        resolve({ code, signal });
      });
    });

    assert.deepEqual(exit, { code: 0, signal: null });
    assert.match(stdout, /"event":"shutdown.completed"/);
  } finally {
    if (child.exitCode === null && child.signalCode === null) {
      child.kill("SIGKILL");
    }
  }
});

test("health process безопасно отклоняет invalid startup configuration", async () => {
  const child = spawn(
    process.execPath,
    [path.resolve(process.cwd(), ".sut-build/src/main.js")],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        SUT_DB_READER_USER: "sut_bootstrap",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  let stdout = "";
  let stderr = "";
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stdout.on("data", (chunk: string) => {
    stdout += chunk;
  });
  child.stderr.on("data", (chunk: string) => {
    stderr += chunk;
  });

  const exit = await new Promise<{
    code: number | null;
    signal: NodeJS.Signals | null;
  }>((resolve, reject) => {
    const timeout = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("Invalid-config health process did not stop"));
    }, 3_000);
    child.once("exit", (code, signal) => {
      clearTimeout(timeout);
      resolve({ code, signal });
    });
  });

  assert.deepEqual(exit, { code: 1, signal: null });
  assert.match(stdout, /"event":"health.startup.failed"/);
  assert.equal(stdout.includes("sut_bootstrap"), false);
  assert.equal(stderr, "");
});
