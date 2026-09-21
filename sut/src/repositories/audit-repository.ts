import type { PoolClient } from "pg";

export type AuditDetail = Readonly<Record<string, boolean | number | string>>;

export type AuditEventInput = Readonly<{
  event: string;
  correlationId?: string | null;
  testRunId?: string | null;
  principalId?: string | null;
  detail?: AuditDetail;
}>;

/**
 * Записывает наблюдаемое событие.
 *
 * Audit trail читается verification role, поэтому тест может подтвердить
 * факт cleanup или отказа в доступе, не полагаясь на логи процесса.
 */
export async function recordAuditEvent(
  client: PoolClient,
  input: AuditEventInput,
): Promise<void> {
  await client.query(
    `INSERT INTO audit_events (
       event, correlation_id, test_run_id, principal_id, detail
     )
     VALUES ($1, $2, $3, $4, $5::jsonb)`,
    [
      input.event,
      input.correlationId ?? null,
      input.testRunId ?? null,
      input.principalId ?? null,
      JSON.stringify(input.detail ?? {}),
    ],
  );
}
