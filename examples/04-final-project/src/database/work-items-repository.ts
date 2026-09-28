import type pg from "pg";

import type { WorkItemRow } from "./types.js";

/**
 * Слой доступа: намерение запроса вместо текста SQL в сценарии.
 *
 * Значения всегда передаются параметрами. Склейка строкой открыла бы
 * внедрение SQL и сломала бы план запроса на первом же апострофе в названии.
 */
export class WorkItemsRepository {
  readonly #pool: pg.Pool;

  constructor(pool: pg.Pool) {
    this.#pool = pool;
  }

  async findById(id: string): Promise<WorkItemRow | undefined> {
    const result = await this.#pool.query<WorkItemRow>(
      `SELECT id, title, description, status, priority,
              test_run_id, creator_test_id, is_seed, version, created_at
         FROM work_items
        WHERE id = $1`,
      [id],
    );

    return result.rows[0];
  }

  async countByStatus(status: string): Promise<number> {
    const result = await this.#pool.query<{ total: string }>(
      `SELECT count(*) AS total FROM work_items WHERE status = $1`,
      [status],
    );

    // Драйвер отдаёт bigint строкой: это не ошибка данных, а защита от
    // потери точности на больших значениях.
    return Number(result.rows[0]?.total ?? "0");
  }

  /** Записи прогона: по ним проверяется, что очистка действительно сработала. */
  async countByTestRun(testRunId: string): Promise<number> {
    const result = await this.#pool.query<{ total: string }>(
      `SELECT count(*) AS total FROM work_items WHERE test_run_id = $1`,
      [testRunId],
    );

    return Number(result.rows[0]?.total ?? "0");
  }

  async findSeedTitles(limit: number): Promise<readonly string[]> {
    const result = await this.#pool.query<{ title: string }>(
      `SELECT title FROM work_items WHERE is_seed = true ORDER BY title LIMIT $1`,
      [limit],
    );

    return Object.freeze(result.rows.map((row) => row.title));
  }
}
