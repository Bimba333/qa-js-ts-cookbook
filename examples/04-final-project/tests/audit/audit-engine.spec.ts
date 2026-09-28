import { expect, test } from "@playwright/test";

import { audit, AuditError, type Finding } from "../../src/audit/index.js";
import type { AuditArea } from "../../src/audit/index.js";

const SPEC: readonly AuditArea[] = Object.freeze([
  { id: "A-01", title: "блокирующее", severity: "blocker", evidence: "команда" },
  { id: "B-01", title: "важное", severity: "major", evidence: "команда" },
  { id: "C-01", title: "мелкое", severity: "minor", evidence: "команда" },
]);

function finding(id: string, status: Finding["status"]): Finding {
  return { id, status, proof: "наблюдение прогона" };
}

test("все области выполнены — кандидат на выпуск", () => {
  const report = audit(
    [finding("A-01", "PASS"), finding("B-01", "PASS"), finding("C-01", "PASS")],
    SPEC,
  );

  expect(report.verdict).toBe("RELEASE CANDIDATE");
  expect(report.debt).toBe(0);
  expect(report.rework).toEqual([]);
});

test("невыполненный блокер отменяет выпуск независимо от суммы весов", () => {
  const report = audit(
    [finding("A-01", "FAIL"), finding("B-01", "PASS"), finding("C-01", "PASS")],
    SPEC,
  );

  expect(report.verdict).toBe("REWORK REQUIRED");
  expect(report.blockers).toEqual(["A-01"]);
});

test("мелкие нарушения не складываются до блокирующего", () => {
  const report = audit(
    [finding("A-01", "PASS"), finding("B-01", "FAIL"), finding("C-01", "FAIL")],
    SPEC,
  );

  // Взвешивание сравнивает варианты доработки, а не отменяет требования:
  // одиннадцать баллов долга — это не блокер.
  expect(report.debt).toBe(11);
  expect(report.verdict).toBe("RELEASE CANDIDATE");
});

test("доработка отсортирована по серьёзности", () => {
  const report = audit(
    [finding("A-01", "FAIL"), finding("B-01", "FAIL"), finding("C-01", "FAIL")],
    SPEC,
  );

  expect(report.rework[0]).toContain("A-01");
  expect(report.rework[1]).toContain("B-01");
  expect(report.rework[2]).toContain("C-01");
});

test("неохваченная область — ошибка аудита, а не молчаливый пропуск", () => {
  expect(() => audit([finding("A-01", "PASS")], SPEC)).toThrow(AuditError);
});

test("наблюдение вне спецификации отвергается", () => {
  expect(() =>
    audit(
      [
        finding("A-01", "PASS"),
        finding("B-01", "PASS"),
        finding("C-01", "PASS"),
        finding("X-99", "PASS"),
      ],
      SPEC,
    ),
  ).toThrow(/вне спецификации/);
});

test("область без доказательства не засчитывается", () => {
  expect(() =>
    audit(
      [
        { id: "A-01", status: "PASS", proof: "   " },
        finding("B-01", "PASS"),
        finding("C-01", "PASS"),
      ],
      SPEC,
    ),
  ).toThrow(/не подтверждена/);
});

test("`NOT APPLICABLE` не создаёт долга", () => {
  const report = audit(
    [
      finding("A-01", "PASS"),
      { id: "B-01", status: "NOT APPLICABLE", proof: "домен не содержит такого поведения" },
      finding("C-01", "PASS"),
    ],
    SPEC,
  );

  expect(report.debt).toBe(0);
  expect(report.verdict).toBe("RELEASE CANDIDATE");
});
