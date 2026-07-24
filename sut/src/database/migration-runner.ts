import type { PoolClient } from "pg";

import type { DatabaseConfig } from "../config/index.js";
import { createDatabasePool } from "./pool.js";
import {
  defaultMigrationDirectory,
  loadMigrations,
  type Migration,
} from "./migration-files.js";

type AppliedMigration = Readonly<{
  version: number;
  name: string;
  checksum: string;
}>;

export type MigrationResult = Readonly<{
  applied: readonly number[];
  currentVersion: number;
  total: number;
}>;

export type MigrationOptions = Readonly<{
  config: DatabaseConfig;
  directory?: string;
  schema?: string;
  lockTimeoutMs?: number;
}>;

const LOCK_NAMESPACE = 1_987_042_501;
const SAFE_IDENTIFIER = /^[a-z][a-z0-9_]{0,62}$/;
const MIN_LOCK_TIMEOUT_MS = 50;
const MAX_LOCK_TIMEOUT_MS = 30_000;

export class MigrationExecutionError extends Error {
  readonly code = "MIGRATION_FAILED";
  readonly migrationName: string;
  readonly migrationVersion: number;

  constructor(migration: Migration, options?: ErrorOptions) {
    super(
      `Migration ${String(migration.version).padStart(3, "0")}-${migration.name} failed`,
      options,
    );
    this.name = "MigrationExecutionError";
    this.migrationName = migration.name;
    this.migrationVersion = migration.version;
  }
}

function quoteIdentifier(identifier: string): string {
  if (!SAFE_IDENTIFIER.test(identifier)) {
    throw new Error("Invalid PostgreSQL schema identifier");
  }

  return `"${identifier}"`;
}

export function migrationLockKey(schema: string): readonly [number, number] {
  let hash = 0;
  for (const character of schema) {
    hash = (Math.imul(hash, 31) + character.charCodeAt(0)) | 0;
  }

  return [LOCK_NAMESPACE, hash];
}

async function acquireMigrationLock(
  client: PoolClient,
  schema: string,
  timeoutMs: number,
): Promise<readonly [number, number]> {
  const lockKey = migrationLockKey(schema);
  const deadline = Date.now() + timeoutMs;

  while (Date.now() <= deadline) {
    const result = await client.query<{ acquired: boolean }>(
      "SELECT pg_try_advisory_lock($1, $2) AS acquired",
      [...lockKey],
    );

    if (result.rows[0]?.acquired === true) {
      return lockKey;
    }

    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  throw new Error("Migration advisory lock timeout");
}

async function createLedger(client: PoolClient, schema: string): Promise<void> {
  const qualifiedLedger = `${quoteIdentifier(schema)}.schema_migrations`;

  await client.query(`
    CREATE TABLE IF NOT EXISTS ${qualifiedLedger} (
      version integer PRIMARY KEY,
      name text NOT NULL,
      checksum text NOT NULL,
      applied_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT schema_migrations_version_positive
        CHECK (version > 0),
      CONSTRAINT schema_migrations_name_nonempty
        CHECK (length(name) > 0),
      CONSTRAINT schema_migrations_checksum_sha256
        CHECK (checksum ~ '^[0-9a-f]{64}$')
    )
  `);
}

async function assertLedgerContract(
  client: PoolClient,
  schema: string,
): Promise<void> {
  const columns = await client.query<{
    column_name: string;
    udt_name: string;
    is_nullable: "YES" | "NO";
    column_default: string | null;
  }>(
    `SELECT column_name, udt_name, is_nullable, column_default
       FROM information_schema.columns
      WHERE table_schema = $1
        AND table_name = 'schema_migrations'
      ORDER BY ordinal_position`,
    [schema],
  );
  const actualColumns = columns.rows.map((column) => ({
    name: column.column_name,
    type: column.udt_name,
    nullable: column.is_nullable,
    hasDefault: column.column_default !== null,
  }));
  const expectedColumns = [
    { name: "version", type: "int4", nullable: "NO", hasDefault: false },
    { name: "name", type: "text", nullable: "NO", hasDefault: false },
    { name: "checksum", type: "text", nullable: "NO", hasDefault: false },
    {
      name: "applied_at",
      type: "timestamptz",
      nullable: "NO",
      hasDefault: true,
    },
  ];

  const constraints = await client.query<{
    conname: string;
    contype: string;
  }>(
    `SELECT constraint_record.conname, constraint_record.contype
       FROM pg_catalog.pg_constraint AS constraint_record
       JOIN pg_catalog.pg_class AS relation
         ON relation.oid = constraint_record.conrelid
       JOIN pg_catalog.pg_namespace AS namespace
         ON namespace.oid = relation.relnamespace
      WHERE namespace.nspname = $1
        AND relation.relname = 'schema_migrations'
      ORDER BY constraint_record.conname`,
    [schema],
  );
  const actualConstraints = constraints.rows.map((constraint) => ({
    name: constraint.conname,
    type: constraint.contype,
  }));
  const expectedConstraints = [
    { name: "schema_migrations_checksum_sha256", type: "c" },
    { name: "schema_migrations_name_nonempty", type: "c" },
    { name: "schema_migrations_pkey", type: "p" },
    { name: "schema_migrations_version_positive", type: "c" },
  ];

  if (
    JSON.stringify(actualColumns) !== JSON.stringify(expectedColumns) ||
    JSON.stringify(actualConstraints) !== JSON.stringify(expectedConstraints)
  ) {
    throw new Error("Existing schema_migrations ledger is incompatible");
  }
}

async function readLedger(
  client: PoolClient,
  schema: string,
): Promise<readonly AppliedMigration[]> {
  const qualifiedLedger = `${quoteIdentifier(schema)}.schema_migrations`;
  const result = await client.query<AppliedMigration>(
    `SELECT version, name, checksum
       FROM ${qualifiedLedger}
      ORDER BY version`,
  );

  return result.rows;
}

export function verifyMigrationDrift(
  migrations: readonly Migration[],
  applied: readonly AppliedMigration[],
): void {
  for (const [index, record] of applied.entries()) {
    const expected = migrations[index];

    if (!expected || expected.version !== record.version) {
      throw new Error(
        `Applied migration version ${record.version} is absent or out of order`,
      );
    }

    if (expected.name !== record.name || expected.checksum !== record.checksum) {
      throw new Error(`Applied migration drift detected: ${record.version}`);
    }
  }
}

export async function runMigrations(
  options: MigrationOptions,
): Promise<MigrationResult> {
  const schema = options.schema ?? "public";
  const lockTimeoutMs = options.lockTimeoutMs ?? 3_000;
  if (
    !Number.isSafeInteger(lockTimeoutMs) ||
    lockTimeoutMs < MIN_LOCK_TIMEOUT_MS ||
    lockTimeoutMs > MAX_LOCK_TIMEOUT_MS
  ) {
    throw new Error("Invalid migration lock timeout");
  }
  const migrations = await loadMigrations(
    options.directory ?? defaultMigrationDirectory(),
  );
  const pool = createDatabasePool(options.config);
  let client: PoolClient | undefined;
  let lockKey: readonly [number, number] | undefined;

  try {
    client = await pool.connect();
    lockKey = await acquireMigrationLock(
      client,
      schema,
      lockTimeoutMs,
    );
    await createLedger(client, schema);
    await assertLedgerContract(client, schema);

    const applied = await readLedger(client, schema);
    verifyMigrationDrift(migrations, applied);

    const newlyApplied: number[] = [];
    const qualifiedLedger = `${quoteIdentifier(schema)}.schema_migrations`;
    const searchPath = `${quoteIdentifier(schema)}, public`;

    for (const migration of migrations.slice(applied.length)) {
      await client.query("BEGIN");
      try {
        await client.query(`SET LOCAL search_path TO ${searchPath}`);
        await client.query(migration.sql);
        await client.query(
          `INSERT INTO ${qualifiedLedger} (version, name, checksum)
           VALUES ($1, $2, $3)`,
          [migration.version, migration.name, migration.checksum],
        );
        await client.query("COMMIT");
        newlyApplied.push(migration.version);
      } catch (error) {
        await client.query("ROLLBACK");
        throw new MigrationExecutionError(migration, { cause: error });
      }
    }

    return Object.freeze({
      applied: Object.freeze(newlyApplied),
      currentVersion: migrations.at(-1)?.version ?? 0,
      total: migrations.length,
    });
  } finally {
    try {
      if (client && lockKey) {
        await client.query("SELECT pg_advisory_unlock($1, $2)", [...lockKey]);
      }
    } finally {
      client?.release();
      await pool.end();
    }
  }
}
