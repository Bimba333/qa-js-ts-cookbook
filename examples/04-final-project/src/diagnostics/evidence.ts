import type { TestInfo } from "@playwright/test";

import { describeFailure } from "./describe-error.js";
import type { DiagnosticEvent } from "./events.js";

const MAX_ATTACHMENT_BYTES = 64 * 1024;

/**
 * Безопасная сериализация с ограничением размера.
 *
 * Циклическая ссылка и многомегабайтное тело — обычные явления в
 * диагностических данных, и оба ломают наивный `JSON.stringify`.
 */
export function serializeEvidence(value: unknown): string {
  const seen = new WeakSet<object>();
  const text = JSON.stringify(
    value,
    (_key, current: unknown) => {
      if (typeof current !== "object" || current === null) return current;
      if (seen.has(current)) return "[циклическая ссылка]";

      seen.add(current);

      return current;
    },
    2,
  );

  if (text === undefined) return '"не удалось сериализовать"';
  if (Buffer.byteLength(text, "utf8") <= MAX_ATTACHMENT_BYTES) return text;

  return `${text.slice(0, MAX_ATTACHMENT_BYTES)}\n… обрезано по ${MAX_ATTACHMENT_BYTES} байт`;
}

export type EvidencePackage = Readonly<{
  correlationId: string;
  project: string;
  workerIndex: number;
  retry: number;
  events: readonly DiagnosticEvent[];
  failures?: readonly unknown[];
}>;

export function buildEvidence(
  testInfo: TestInfo,
  correlationId: string,
  events: readonly DiagnosticEvent[],
  error?: unknown,
): EvidencePackage {
  return Object.freeze({
    correlationId,
    project: testInfo.project.name,
    workerIndex: testInfo.workerIndex,
    retry: testInfo.retry,
    events,
    ...(error === undefined ? {} : { failures: describeFailure(error) }),
  });
}

/**
 * Доказательства прикладываются только к упавшему тесту.
 *
 * У зелёного они никому не нужны, а место и время прогона стоят дорого —
 * то же правило, что для трассировки в главе 253.
 */
export async function attachEvidence(
  testInfo: TestInfo,
  evidence: EvidencePackage,
): Promise<void> {
  await testInfo.attach("scenario-evidence", {
    body: serializeEvidence(evidence),
    contentType: "application/json",
  });
}
