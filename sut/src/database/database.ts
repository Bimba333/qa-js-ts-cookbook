import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from "pg";

import { toPoolConfig, type DatabaseConfig } from "../config/index.js";

/**
 * Долгоживущий пул приложения.
 *
 * В отличие от `withDatabaseClient`, который создаёт и закрывает пул на одну
 * операцию, сервер держит один пул на весь процесс и закрывает его при
 * graceful shutdown.
 */
export class Database {
  readonly #pool: Pool;
  #closed = false;

  constructor(config: DatabaseConfig, maxConnections = 10) {
    this.#pool = new Pool({ ...toPoolConfig(config), max: maxConnections });
  }

  async query<Row extends QueryResultRow = QueryResultRow>(
    text: string,
    values: readonly unknown[] = [],
  ): Promise<QueryResult<Row>> {
    return this.#pool.query<Row>(text, values as unknown[]);
  }

  /**
   * Выполняет операцию в транзакции. Любая ошибка откатывает изменения
   * целиком: частично применённый setup теста хуже, чем отсутствующий.
   */
  async withTransaction<T>(
    operation: (client: PoolClient) => Promise<T>,
  ): Promise<T> {
    const client = await this.#pool.connect();

    try {
      await client.query("BEGIN");
      const result = await operation(client);
      await client.query("COMMIT");

      return result;
    } catch (error) {
      try {
        await client.query("ROLLBACK");
      } catch {
        // Откат мог не состояться из-за разорванного соединения.
        // Исходная ошибка остаётся авторитетной.
      }
      throw error;
    } finally {
      client.release();
    }
  }

  async withClient<T>(
    operation: (client: PoolClient) => Promise<T>,
  ): Promise<T> {
    const client = await this.#pool.connect();

    try {
      return await operation(client);
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    if (this.#closed) return;
    this.#closed = true;
    await this.#pool.end();
  }
}
