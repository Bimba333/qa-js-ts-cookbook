import assert from "node:assert/strict";
import { mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { loadDatabaseConfig } from "../src/config/index.js";
import {
  loadMigrations,
  normalizeMigrationSql,
} from "../src/database/migration-files.js";
import {
  MigrationExecutionError,
  migrationLockKey,
  runMigrations,
} from "../src/database/migration-runner.js";
import { createDatabasePool } from "../src/database/pool.js";
import {
  createTestSchema,
  dropTestSchema,
  fixtureMigrationDirectory,
  uniqueSchema,
  withRoleClient,
} from "./support/database.js";

const migrationConfig = loadDatabaseConfig("migration");

test("применяет ordered migrations и записывает ledger", async () => {
  const schema = uniqueSchema("migration_clean");
  await createTestSchema(schema);

  try {
    const first = await runMigrations({
      config: migrationConfig,
      directory: fixtureMigrationDirectory("valid"),
      schema,
    });
    const second = await runMigrations({
      config: migrationConfig,
      directory: fixtureMigrationDirectory("valid"),
      schema,
    });

    assert.deepEqual(first.applied, [1, 2]);
    assert.deepEqual(second.applied, []);

    await withRoleClient("migration", async (client) => {
      const ledger = await client.query(
        `SELECT version FROM "${schema}".schema_migrations ORDER BY version`,
      );
      const columns = await client.query(
        `SELECT column_name
           FROM information_schema.columns
          WHERE table_schema = $1
            AND table_name = 'migration_probe'
          ORDER BY ordinal_position`,
        [schema],
      );

      assert.deepEqual(
        ledger.rows.map((row) => row.version),
        [1, 2],
      );
      assert.deepEqual(
        columns.rows.map((row) => row.column_name),
        ["id", "label"],
      );
    });
  } finally {
    await dropTestSchema(schema);
  }
});

test("отклоняет gap и duplicate migration versions", async () => {
  await assert.rejects(
    loadMigrations(fixtureMigrationDirectory("gap")),
    /Migration gap/,
  );
  await assert.rejects(
    loadMigrations(fixtureMigrationDirectory("duplicate")),
    /Duplicate migration version/,
  );
});

test("нормализует CRLF и отклоняет bare CR в checksum input", () => {
  assert.equal(
    normalizeMigrationSql(Buffer.from("SELECT 1;\r\nSELECT 2;\r\n")),
    "SELECT 1;\nSELECT 2;\n",
  );
  assert.throws(
    () => normalizeMigrationSql(Buffer.from("SELECT 1;\rSELECT 2;")),
    /bare CR/,
  );
});

test("отклоняет symlink и invalid UTF-8 migration files", async () => {
  const fixtureRoot = path.resolve(
    process.cwd(),
    "sut/tests/fixtures/migrations",
  );
  const target = path.resolve(
    process.cwd(),
    "sut/tests/fixtures/migration-symlink-target.sql",
  );
  const symlinkDirectory = await mkdtemp(path.join(fixtureRoot, "symlink-"));
  const invalidDirectory = await mkdtemp(path.join(fixtureRoot, "encoding-"));

  try {
    await writeFile(target, "SELECT 1;\n");
    await symlink(target, path.join(symlinkDirectory, "001-outside.sql"));
    await writeFile(
      path.join(invalidDirectory, "001-invalid.sql"),
      Buffer.from([0xc3, 0x28]),
    );

    await assert.rejects(
      loadMigrations(symlinkDirectory),
      /regular file/,
    );
    await assert.rejects(loadMigrations(invalidDirectory), /encoded data/);
  } finally {
    await rm(symlinkDirectory, { recursive: true, force: true });
    await rm(invalidDirectory, { recursive: true, force: true });
    await rm(target, { force: true });
  }
});

test("обнаруживает изменение уже применённой migration", async () => {
  const schema = uniqueSchema("migration_drift");
  await createTestSchema(schema);

  try {
    await runMigrations({
      config: migrationConfig,
      directory: fixtureMigrationDirectory("valid"),
      schema,
    });

    await assert.rejects(
      runMigrations({
        config: migrationConfig,
        directory: fixtureMigrationDirectory("modified"),
        schema,
      }),
      /drift detected/,
    );
  } finally {
    await dropTestSchema(schema);
  }
});

test("откатывает failed migration без partial ledger и сохраняет identity", async () => {
  const schema = uniqueSchema("migration_failure");
  await createTestSchema(schema);

  try {
    await assert.rejects(
      runMigrations({
        config: migrationConfig,
        directory: fixtureMigrationDirectory("failure"),
        schema,
      }),
      (error: unknown) =>
        error instanceof MigrationExecutionError &&
        error.migrationVersion === 1 &&
        error.migrationName === "failing-probe" &&
        !error.message.includes("CREATE TABLE"),
    );

    await withRoleClient("migration", async (client) => {
      const relation = await client.query<{ name: string | null }>(
        "SELECT to_regclass($1) AS name",
        [`${schema}.migration_failure_probe`],
      );
      const ledger = await client.query(
        `SELECT version FROM "${schema}".schema_migrations`,
      );

      assert.equal(relation.rows[0]?.name, null);
      assert.equal(ledger.rowCount, 0);
    });

    const retry = await runMigrations({
      config: migrationConfig,
      directory: fixtureMigrationDirectory("valid"),
      schema,
    });
    assert.deepEqual(retry.applied, [1, 2]);
  } finally {
    await dropTestSchema(schema);
  }
});

test("обнаруживает удалённую ранее применённую migration", async () => {
  const schema = uniqueSchema("migration_removed");
  await createTestSchema(schema);

  try {
    await runMigrations({
      config: migrationConfig,
      directory: fixtureMigrationDirectory("valid"),
      schema,
    });

    await assert.rejects(
      runMigrations({
        config: migrationConfig,
        directory: fixtureMigrationDirectory("removed"),
        schema,
      }),
      /absent or out of order/,
    );
  } finally {
    await dropTestSchema(schema);
  }
});

test("отклоняет несовместимый существующий migration ledger", async () => {
  const schema = uniqueSchema("migration_ledger");
  await createTestSchema(schema);

  try {
    await withRoleClient("migration", (client) =>
      client.query(
        `CREATE TABLE "${schema}".schema_migrations (
           version integer,
           name text,
           checksum text,
           applied_at timestamptz
         )`,
      ),
    );

    await assert.rejects(
      runMigrations({
        config: migrationConfig,
        directory: fixtureMigrationDirectory("valid"),
        schema,
      }),
      /ledger is incompatible/,
    );
  } finally {
    await dropTestSchema(schema);
  }
});

test("ограниченно ожидает занятый advisory lock", async () => {
  const schema = uniqueSchema("migration_lock");
  await createTestSchema(schema);
  const pool = createDatabasePool(migrationConfig);
  const lockClient = await pool.connect();
  const lockKey = migrationLockKey(schema);

  try {
    await lockClient.query("SELECT pg_advisory_lock($1, $2)", [...lockKey]);

    await assert.rejects(
      runMigrations({
        config: migrationConfig,
        directory: fixtureMigrationDirectory("valid"),
        schema,
        lockTimeoutMs: 150,
      }),
      /advisory lock timeout/,
    );
  } finally {
    await lockClient.query("SELECT pg_advisory_unlock($1, $2)", [...lockKey]);
    lockClient.release();
    await pool.end();
    await dropTestSchema(schema);
  }
});

test("конкурирующие runners сериализуют migration application", async () => {
  const schema = uniqueSchema("migration_concurrent");
  await createTestSchema(schema);

  try {
    const results = await Promise.all([
      runMigrations({
        config: migrationConfig,
        directory: fixtureMigrationDirectory("valid"),
        schema,
      }),
      runMigrations({
        config: migrationConfig,
        directory: fixtureMigrationDirectory("valid"),
        schema,
      }),
    ]);

    assert.deepEqual(
      results.map((result) => result.applied.length).sort(),
      [0, 2],
    );
  } finally {
    await dropTestSchema(schema);
  }
});
