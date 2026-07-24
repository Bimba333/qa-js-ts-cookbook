import { readFile } from "node:fs/promises";
import path from "node:path";

import type { PoolClient } from "pg";

import type { DatabaseConfig } from "../config/index.js";
import { withDatabaseClient } from "./pool.js";

export const TESTER_USER_ID = "10000000-0000-4000-8000-000000000001";
export const VIEWER_USER_ID = "10000000-0000-4000-8000-000000000002";
const SEED_CREATED_AT = "2026-01-01T00:00:00.000Z";

const SEED_FILE = path.resolve(
  process.cwd(),
  "sut/seed/001-minimal-seed.sql",
);

export type SeedResult = Readonly<{
  requiredUsers: number;
  totalSeedUsers: number;
}>;

export async function readSeedSql(): Promise<string> {
  const sql = await readFile(SEED_FILE, "utf8");
  if (sql.trim().length === 0) {
    throw new Error("Seed file is empty");
  }

  return sql;
}

export async function verifySeedRows(
  client: PoolClient,
): Promise<SeedResult> {
  const result = await client.query<{
    id: string;
    login: string;
    role: string;
    is_active: boolean;
    is_seed: boolean;
    password_salt: string;
    password_hash: string;
    created_at: Date;
  }>(
    `SELECT
       id,
       login,
       role,
       is_active,
       is_seed,
       password_salt,
       password_hash,
       created_at
       FROM users
      WHERE id = ANY($1::uuid[])
      ORDER BY id`,
    [[TESTER_USER_ID, VIEWER_USER_ID]],
  );

  const expected = [
    {
      id: TESTER_USER_ID,
      login: "educational_tester",
      role: "tester",
      is_active: true,
      is_seed: true,
      password_salt: "phase1-tester-salt",
      password_hash:
        "phase1-placeholder-hash-tester-00000000000000000000000000000001",
      created_at: SEED_CREATED_AT,
    },
    {
      id: VIEWER_USER_ID,
      login: "educational_viewer",
      role: "viewer",
      is_active: true,
      is_seed: true,
      password_salt: "phase1-viewer-salt",
      password_hash:
        "phase1-placeholder-hash-viewer-00000000000000000000000000000002",
      created_at: SEED_CREATED_AT,
    },
  ];

  const actual = result.rows.map((row) => ({
    ...row,
    created_at: row.created_at.toISOString(),
  }));

  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error("Seed drift detected");
  }

  const count = await client.query<{ count: string }>(
    "SELECT count(*)::text AS count FROM users WHERE is_seed",
  );

  const totalSeedUsers = Number(count.rows[0]?.count ?? 0);
  if (totalSeedUsers !== expected.length) {
    throw new Error("Unexpected seed user detected");
  }

  return Object.freeze({
    requiredUsers: result.rowCount ?? 0,
    totalSeedUsers,
  });
}

export async function applySeed(
  config: DatabaseConfig,
): Promise<SeedResult> {
  const sql = await readSeedSql();

  return withDatabaseClient(config, async (client) => {
    await client.query("BEGIN");
    try {
      await client.query(sql);
      const result = await verifySeedRows(client);
      await client.query("COMMIT");

      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  });
}
