import type { DatabaseConfig } from "../config/index.js";
import { readSeedSql, verifySeedRows } from "./seed-runner.js";
import { withDatabaseClient } from "./pool.js";

export type ResetResult = Readonly<{
  removedWorkItems: number;
  removedUsers: number;
}>;

export async function resetEducationalDatabase(
  config: DatabaseConfig,
): Promise<ResetResult> {
  if (config.mode !== "educational") {
    throw new Error("Reset requires educational mode");
  }

  const seedSql = await readSeedSql();

  return withDatabaseClient(config, async (client) => {
    await client.query("BEGIN");
    try {
      const workItems = await client.query(
        "DELETE FROM work_items WHERE is_seed = false",
      );
      const users = await client.query(
        "DELETE FROM users WHERE is_seed = false",
      );
      await client.query(seedSql);
      await verifySeedRows(client);
      await client.query("COMMIT");

      return Object.freeze({
        removedWorkItems: workItems.rowCount ?? 0,
        removedUsers: users.rowCount ?? 0,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  });
}
