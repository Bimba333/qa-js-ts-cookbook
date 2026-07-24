import { Pool, type PoolClient } from "pg";

import {
  toPoolConfig,
  type DatabaseConfig,
} from "../config/index.js";

export function createDatabasePool(config: DatabaseConfig): Pool {
  return new Pool(toPoolConfig(config));
}

export async function withDatabaseClient<T>(
  config: DatabaseConfig,
  operation: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const pool = createDatabasePool(config);

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
