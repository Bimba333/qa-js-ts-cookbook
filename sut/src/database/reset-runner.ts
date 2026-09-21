import type { DatabaseConfig } from "../config/index.js";
import { applySeedWithClient } from "./seed-runner.js";
import { withDatabaseClient } from "./pool.js";

export type ResetResult = Readonly<{
  removedWorkItems: number;
  removedUsers: number;
  removedTestRuns: number;
  removedAuditEvents: number;
}>;

/**
 * Возвращает учебную базу в исходное состояние.
 *
 * Удаление идёт в порядке, безопасном для foreign keys: сначала строки,
 * которые ссылаются на test run, затем сам run и только потом пользователи.
 * Seed-данные не удаляются: их восстанавливает повторное применение seed.
 */
export async function resetEducationalDatabase(
  config: DatabaseConfig,
): Promise<ResetResult> {
  if (config.mode !== "educational") {
    throw new Error("Reset requires educational mode");
  }

  return withDatabaseClient(config, async (client) => {
    await client.query("BEGIN");
    try {
      const auditEvents = await client.query("DELETE FROM audit_events");
      const workItems = await client.query(
        "DELETE FROM work_items WHERE is_seed = false",
      );
      await client.query("DELETE FROM auth_tokens");
      await client.query("DELETE FROM ui_sessions");
      const testRuns = await client.query("DELETE FROM test_runs");
      const users = await client.query(
        "DELETE FROM users WHERE is_seed = false",
      );

      await applySeedWithClient(client);
      await client.query("COMMIT");

      return Object.freeze({
        removedWorkItems: workItems.rowCount ?? 0,
        removedUsers: users.rowCount ?? 0,
        removedTestRuns: testRuns.rowCount ?? 0,
        removedAuditEvents: auditEvents.rowCount ?? 0,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  });
}
