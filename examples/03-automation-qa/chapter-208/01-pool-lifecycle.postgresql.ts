import { expect, test } from "@playwright/test";
import { withIsolatedPool } from "../support/postgresql/postgresql-test-db.js";

test("возвращает подключение в пул и завершает пул", async () => {
  await withIsolatedPool(async ({ client, pool }) => {
    const result = await client.query<{ value: number }>("SELECT 1 AS value");

    expect(result.rows[0]?.value).toBe(1);
    expect(pool.totalCount).toBe(1);
    expect(pool.idleCount).toBe(0);
  });

  await expect(withIsolatedPool(async () => {
    throw new Error("controlled query failure");
  })).rejects.toThrow("controlled query failure");
});
