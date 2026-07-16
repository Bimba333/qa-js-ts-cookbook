import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import {
  Client,
  Pool,
  type PoolClient,
  type PoolConfig,
} from "pg";

const schemaSqlPath = fileURLToPath(
  new URL("../../postgresql/schema.sql", import.meta.url),
);

export type TestDatabaseContext = {
  client: PoolClient | Client;
  schema: string;
};

type OperationOutcome<Result> =
  | { ok: true; value: Result }
  | { ok: false; error: unknown };

const requiredEnvironmentValue = (name: string): string => {
  const value = process.env[name];
  if (value === undefined || value === "") {
    throw new Error(`${name} is required for PostgreSQL examples`);
  }
  return value;
};

export const postgresqlConfig = (): PoolConfig => {
  const host = requiredEnvironmentValue("PGHOST");
  const database = requiredEnvironmentValue("PGDATABASE");
  const port = Number(requiredEnvironmentValue("PGPORT"));

  if (host !== "127.0.0.1" && host !== "localhost") {
    throw new Error("PostgreSQL examples accept loopback hosts only");
  }
  if (!/^qa_book_test(?:_[a-z0-9_]+)?$/.test(database)) {
    throw new Error("PostgreSQL examples require a test-only database name");
  }
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error("PGPORT must be an integer between 1 and 65535");
  }

  return {
    host,
    port,
    user: requiredEnvironmentValue("PGUSER"),
    password: requiredEnvironmentValue("PGPASSWORD"),
    database,
    application_name: "qa-book-postgresql-examples",
  };
};

const quoteSchema = (schema: string): string => {
  if (!/^qa_[a-f0-9]+$/.test(schema)) {
    throw new Error("Unsafe test schema identifier");
  }
  return `"${schema}"`;
};

const createSchemaName = (): string => `qa_${randomUUID().replaceAll("-", "")}`;

const prepareSchema = async (
  client: Client | PoolClient,
  schema: string,
): Promise<void> => {
  const identifier = quoteSchema(schema);
  const schemaSql = await readFile(schemaSqlPath, "utf8");

  await client.query(`CREATE SCHEMA ${identifier}`);
  await client.query(`SET search_path TO ${identifier}, public`);
  await client.query(schemaSql);
};

const dropSchema = async (client: Client | PoolClient, schema: string): Promise<void> => {
  await client.query("ROLLBACK");
  await client.query("SET search_path TO public");
  await client.query(`DROP SCHEMA IF EXISTS ${quoteSchema(schema)} CASCADE`);
};

const finishOperation = <Result>(
  outcome: OperationOutcome<Result>,
  cleanupErrors: unknown[],
): Result => {
  if (!outcome.ok && cleanupErrors.length > 0) {
    throw new AggregateError(
      [outcome.error, ...cleanupErrors],
      "PostgreSQL operation and resource cleanup both failed",
    );
  }
  if (!outcome.ok) {
    throw outcome.error;
  }
  if (cleanupErrors.length > 0) {
    throw new AggregateError(cleanupErrors, "PostgreSQL resource cleanup failed");
  }
  return outcome.value;
};

export const withIsolatedClient = async <Result>(
  run: (context: TestDatabaseContext) => Promise<Result>,
): Promise<Result> => {
  const client = new Client(postgresqlConfig());
  let schema: string | undefined;
  let outcome: OperationOutcome<Result>;

  try {
    await client.connect();
    schema = createSchemaName();
    await prepareSchema(client, schema);
    outcome = { ok: true, value: await run({ client, schema }) };
  } catch (error) {
    outcome = { ok: false, error };
  }

  const cleanupErrors: unknown[] = [];
  if (schema !== undefined) {
    try {
      await dropSchema(client, schema);
    } catch (error) {
      cleanupErrors.push(error);
    }
  }
  try {
    await client.end();
  } catch (error) {
    cleanupErrors.push(error);
  }

  return finishOperation(outcome, cleanupErrors);
};

export const withIsolatedPool = async <Result>(
  run: (context: TestDatabaseContext & {
    pool: Pick<Pool, "idleCount" | "totalCount">;
  }) => Promise<Result>,
): Promise<Result> => {
  const pool = new Pool({ ...postgresqlConfig(), max: 2 });
  let client: PoolClient | undefined;
  let schema: string | undefined;
  let outcome: OperationOutcome<Result>;

  try {
    client = await pool.connect();
    schema = createSchemaName();
    await prepareSchema(client, schema);
    outcome = { ok: true, value: await run({ client, pool, schema }) };
  } catch (error) {
    outcome = { ok: false, error };
  }

  const cleanupErrors: unknown[] = [];
  if (client !== undefined) {
    if (schema !== undefined) {
      try {
        await dropSchema(client, schema);
      } catch (error) {
        cleanupErrors.push(error);
      }
    }
    try {
      client.release();
    } catch (error) {
      cleanupErrors.push(error);
    }
  }
  try {
    await pool.end();
  } catch (error) {
    cleanupErrors.push(error);
  }

  return finishOperation(outcome, cleanupErrors);
};
