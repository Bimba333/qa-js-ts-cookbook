import { expect, test } from "@playwright/test";
import pg from "pg";

import { sutConfig } from "../support/sut/config.js";

/** Открывает пул, отдаёт его сценарию и гарантированно закрывает. */
async function withPool<T>(
  operation: (pool: pg.Pool) => Promise<T>,
): Promise<T> {
  const pool = new pg.Pool({ ...sutConfig().database, max: 2 });

  try {
    return await operation(pool);
  } finally {
    // Пул держит открытые соединения, поэтому процесс не завершится,
    // пока они не закрыты. Закрытие принадлежит владельцу пула.
    await pool.end();
  }
}

test("возвращает подключение в пул и завершает пул", async () => {
  await withPool(async (pool) => {
    const client = await pool.connect();

    try {
      const result = await client.query<{ value: number }>("SELECT 1 AS value");

      expect(result.rows[0]?.value).toBe(1);
      expect(pool.totalCount).toBe(1);
      // Пока клиент занят, свободных соединений нет.
      expect(pool.idleCount).toBe(0);
    } finally {
      client.release();
    }

    // После release соединение возвращается в пул, а не закрывается.
    expect(pool.idleCount).toBe(1);
    expect(pool.totalCount).toBe(1);
  });
});

test("закрывает пул даже после ошибки сценария", async () => {
  await expect(
    withPool(async () => {
      throw new Error("controlled query failure");
    }),
  ).rejects.toThrow("controlled query failure");
});
