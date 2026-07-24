import { randomUUID } from "node:crypto";
import path from "node:path";

import type { PoolClient } from "pg";

import {
  loadDatabaseConfig,
  type DatabaseRole,
} from "../../src/config/index.js";
import {
  createDatabasePool,
  withDatabaseClient,
} from "../../src/database/pool.js";

export function fixtureMigrationDirectory(name: string): string {
  return path.resolve(
    process.cwd(),
    "sut/tests/fixtures/migrations",
    name,
  );
}

export function uniqueSchema(prefix: string): string {
  return `${prefix}_${randomUUID().replaceAll("-", "")}`.slice(0, 63);
}

export async function createTestSchema(schema: string): Promise<void> {
  await withDatabaseClient(
    loadDatabaseConfig("migration"),
    async (client) => {
      await client.query(`CREATE SCHEMA "${schema}" AUTHORIZATION sut_migrator`);
    },
  );
}

export async function dropTestSchema(schema: string): Promise<void> {
  await withDatabaseClient(
    loadDatabaseConfig("migration"),
    async (client) => {
      await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
    },
  );
}

export async function withRoleClient<T>(
  role: DatabaseRole,
  operation: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const pool = createDatabasePool(loadDatabaseConfig(role));
  try {
    const client = await pool.connect();
    try {
      return await operation(client);
    } finally {
      client.release();
    }
  } finally {
    await pool.end();
  }
}

export async function inRollbackTransaction<T>(
  operation: (client: PoolClient) => Promise<T>,
): Promise<T> {
  return withRoleClient("migration", async (client) => {
    await client.query("BEGIN");
    try {
      return await operation(client);
    } finally {
      await client.query("ROLLBACK");
    }
  });
}
