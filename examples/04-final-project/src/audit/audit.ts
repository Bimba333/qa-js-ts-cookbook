import {
  AUDIT_SPECIFICATION,
  SEVERITY_WEIGHT,
  type AuditArea,
  type Severity,
} from "./specification.js";

export const statuses = ["PASS", "FAIL", "NOT APPLICABLE"] as const;

export type AuditStatus = (typeof statuses)[number];

export type Finding = Readonly<{
  id: string;
  status: AuditStatus;
  /** Чем подтверждён итог: команда, файл, наблюдение. */
  proof: string;
  note?: string;
}>;

export type AuditLine = AuditArea & Finding;

export type AuditReport = Readonly<{
  lines: readonly AuditLine[];
  /** Сумма весов невыполненных областей: чем больше, тем дальше до выпуска. */
  debt: number;
  blockers: readonly string[];
  verdict: "RELEASE CANDIDATE" | "REWORK REQUIRED";
  rework: readonly string[];
}>;

export class AuditError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuditError";
  }
}

/**
 * Сводит замороженную спецификацию с наблюдениями прогона.
 *
 * Аудит не придумывает итог: он требует наблюдение для КАЖДОЙ области.
 * Пропущенная область — не «наверное, в порядке», а ошибка самого аудита.
 */
export function audit(
  findings: readonly Finding[],
  specification: readonly AuditArea[] = AUDIT_SPECIFICATION,
): AuditReport {
  const byId = new Map(findings.map((finding) => [finding.id, finding]));
  const unknown = findings.filter(
    (finding) => !specification.some((area) => area.id === finding.id),
  );

  if (unknown.length > 0) {
    throw new AuditError(
      `Наблюдения вне спецификации: ${unknown.map((f) => f.id).join(", ")}`,
    );
  }

  const lines: AuditLine[] = specification.map((area) => {
    const finding = byId.get(area.id);

    if (!finding) {
      throw new AuditError(`Для области ${area.id} нет наблюдения`);
    }

    if (finding.proof.trim() === "") {
      throw new AuditError(`Область ${area.id} не подтверждена доказательством`);
    }

    return Object.freeze({ ...area, ...finding });
  });

  const failed = lines.filter((line) => line.status === "FAIL");
  const debt = failed.reduce(
    (sum, line) => sum + SEVERITY_WEIGHT[line.severity as Severity],
    0,
  );
  const blockers = failed
    .filter((line) => line.severity === "blocker")
    .map((line) => line.id);

  return Object.freeze({
    lines: Object.freeze(lines),
    debt,
    blockers: Object.freeze(blockers),
    // Один невыполненный блокер отменяет выпуск независимо от суммы весов:
    // взвешивание сравнивает варианты доработки, а не отменяет требования.
    verdict: blockers.length === 0 ? "RELEASE CANDIDATE" : "REWORK REQUIRED",
    rework: Object.freeze(
      [...failed]
        .sort(
          (left, right) =>
            SEVERITY_WEIGHT[right.severity] - SEVERITY_WEIGHT[left.severity] ||
            left.id.localeCompare(right.id),
        )
        .map((line) => `${line.id} (${line.severity}): ${line.note ?? line.title}`),
    ),
  });
}

/** Человекочитаемый отчёт: его читают люди, а не программы. */
export function formatReport(report: AuditReport): string {
  const rows = report.lines.map(
    (line) =>
      `${line.status.padEnd(15)} ${line.id.padEnd(9)} ${line.severity.padEnd(8)} ${line.title}`,
  );

  const tail = [
    "",
    `Долг по весам: ${report.debt}`,
    `Блокеры: ${report.blockers.length > 0 ? report.blockers.join(", ") : "нет"}`,
    `Итог: ${report.verdict}`,
  ];

  if (report.rework.length > 0) {
    tail.push("", "Требуется доработка:", ...report.rework.map((item) => `  - ${item}`));
  }

  return [...rows, ...tail].join("\n");
}
