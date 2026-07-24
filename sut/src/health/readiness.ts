import type { DatabaseConfig } from "../config/index.js";
import { loadMigrations } from "../database/migration-files.js";
import { createDatabasePool } from "../database/pool.js";
import {
  TESTER_USER_ID,
  VIEWER_USER_ID,
} from "../database/seed-runner.js";

export type ReadinessCheck = Readonly<{
  name: "database" | "migrations" | "seed";
  status: "PASS" | "BLOCKED";
}>;

export type Phase1Readiness = Readonly<{
  status: "PASS" | "BLOCKED";
  capability: "phase1-foundation";
  checks: readonly ReadinessCheck[];
}>;

export async function checkPhase1Readiness(
  config: DatabaseConfig,
  schema = "public",
): Promise<Phase1Readiness> {
  if (!/^[a-z][a-z0-9_]{0,62}$/.test(schema)) {
    throw new Error("Invalid readiness schema identifier");
  }

  const checks: ReadinessCheck[] = [];
  const pool = createDatabasePool(config);

  try {
    const client = await pool.connect();
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
        const seedState = await client.query<{ ready: boolean }>(
          `SELECT
             count(*) = 2
             AND count(*) FILTER (
               WHERE id = $1
                 AND login = 'educational_tester'
                 AND role = 'tester'
                 AND is_seed = true
                 AND is_active = true
                 AND created_at = '2026-01-01T00:00:00Z'::timestamptz
             ) = 1
             AND count(*) FILTER (
               WHERE id = $2
                 AND login = 'educational_viewer'
                 AND role = 'viewer'
                 AND is_seed = true
                 AND is_active = true
                 AND created_at = '2026-01-01T00:00:00Z'::timestamptz
             ) = 1 AS ready
             FROM "${schema}".users
            WHERE is_seed = true`,
          [TESTER_USER_ID, VIEWER_USER_ID],
        );
        seedReady = seedState.rows[0]?.ready === true;
      }
      checks.push({
        name: "seed",
        status: seedReady ? "PASS" : "BLOCKED",
      });
    } finally {
      client.release();
    }
  } catch {
    if (!checks.some((check) => check.name === "database")) {
      checks.push({ name: "database", status: "BLOCKED" });
    }
    if (!checks.some((check) => check.name === "migrations")) {
      checks.push({ name: "migrations", status: "BLOCKED" });
    }
    if (!checks.some((check) => check.name === "seed")) {
      checks.push({ name: "seed", status: "BLOCKED" });
    }
  } finally {
    await pool.end();
  }

  return Object.freeze({
    status: checks.every((check) => check.status === "PASS")
      ? "PASS"
      : "BLOCKED",
    capability: "phase1-foundation",
    checks: Object.freeze(checks),
  });
}
