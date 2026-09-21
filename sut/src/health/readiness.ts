import type { PoolClient } from "pg";

import type { DatabaseConfig } from "../config/index.js";
import { loadMigrations } from "../database/migration-files.js";
import { createDatabasePool } from "../database/pool.js";
import { verifySeedRows } from "../database/seed-runner.js";

export type ReadinessCheck = Readonly<{
  name: "database" | "migrations" | "seed";
  status: "PASS" | "BLOCKED";
}>;

export type SutReadiness = Readonly<{
  status: "PASS" | "BLOCKED";
  capability: "sut-foundation";
  checks: readonly ReadinessCheck[];
}>;

const SAFE_SCHEMA = /^[a-z][a-z0-9_]{0,62}$/;

function blockedReadiness(checks: ReadinessCheck[]): SutReadiness {
  for (const name of ["database", "migrations", "seed"] as const) {
    if (!checks.some((check) => check.name === name)) {
      checks.push({ name, status: "BLOCKED" });
    }
  }

  return Object.freeze({
    status: "BLOCKED" as const,
    capability: "sut-foundation" as const,
    checks: Object.freeze([...checks]),
  });
}

/**
 * Проверяет готовность на уже открытом соединении.
 *
 * HTTP-обработчик health вызывает эту версию, чтобы частый опрос со стороны
 * Docker не создавал и не закрывал пул на каждый запрос.
 */
export async function checkReadinessWithClient(
  client: PoolClient,
  schema = "public",
): Promise<SutReadiness> {
  if (!SAFE_SCHEMA.test(schema)) {
    throw new Error("Invalid readiness schema identifier");
  }

  const checks: ReadinessCheck[] = [];

  try {
    await client.query("SELECT 1");
    checks.push({ name: "database", status: "PASS" });

    const migrations = await loadMigrations();
    const migrationState = await client.query<{
      version: number;
      name: string;
      checksum: string;
    }>(
      `SELECT version, name, checksum
         FROM "${schema}".schema_migrations
        ORDER BY version`,
    );
    const migrationReady =
      migrationState.rowCount === migrations.length &&
      migrationState.rows.every(
        (row, index) =>
          row.version === migrations[index]?.version &&
          row.name === migrations[index]?.name &&
          row.checksum === migrations[index]?.checksum,
      );
    checks.push({
      name: "migrations",
      status: migrationReady ? "PASS" : "BLOCKED",
    });

    let seedReady = false;
    if (migrationReady) {
      try {
        await client.query(`SET search_path TO "${schema}", public`);
        // Verification role не имеет доступа к credential material,
        // поэтому seed сверяется без соли и hash.
        await verifySeedRows(client, { includeCredentials: false });
        seedReady = true;
      } catch {
        seedReady = false;
      }
    }
    checks.push({ name: "seed", status: seedReady ? "PASS" : "BLOCKED" });
  } catch {
    return blockedReadiness(checks);
  }

  return Object.freeze({
    status: checks.every((check) => check.status === "PASS")
      ? "PASS"
      : "BLOCKED",
    capability: "sut-foundation" as const,
    checks: Object.freeze(checks),
  });
}

export async function checkSutReadiness(
  config: DatabaseConfig,
  schema = "public",
): Promise<SutReadiness> {
  const pool = createDatabasePool(config);

  try {
    const client = await pool.connect();
    try {
      return await checkReadinessWithClient(client, schema);
    } finally {
      client.release();
    }
  } catch {
    return blockedReadiness([]);
  } finally {
    await pool.end();
  }
}
