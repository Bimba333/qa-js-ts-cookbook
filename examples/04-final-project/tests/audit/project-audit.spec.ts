import { expect, test } from "@playwright/test";

import {
  audit,
  AUDIT_SPECIFICATION,
  formatReport,
} from "../../src/audit/index.js";
import { CURRENT_FINDINGS } from "../../src/audit/findings.js";

test("аудит проекта охватывает всю спецификацию", async ({}, testInfo) => {
  const report = audit(CURRENT_FINDINGS);

  expect(report.lines.length).toBe(AUDIT_SPECIFICATION.length);

  // Отчёт прикладывается всегда: он и есть результат этой главы.
  await testInfo.attach("audit-report", {
    body: formatReport(report),
    contentType: "text/plain",
  });
});

test("итог соответствует наблюдениям, а не ожиданиям", () => {
  const report = audit(CURRENT_FINDINGS);
  const failed = report.lines.filter((line) => line.status === "FAIL");

  // Проект намеренно не объявлен готовым: портфель сценариев не закрыт.
  expect(failed.map((line) => line.id)).toEqual(["PORT-01"]);
  expect(report.verdict).toBe("REWORK REQUIRED");
  expect(report.blockers).toEqual(["PORT-01"]);
});

test("каждая невыполненная область объясняет, что именно доделать", () => {
  const report = audit(CURRENT_FINDINGS);

  for (const item of report.rework) {
    expect(item.length).toBeGreaterThan(40);
  }

  expect(report.rework[0]).toContain("UI-01");
});

test("каждое наблюдение подтверждено доказательством", () => {
  for (const finding of CURRENT_FINDINGS) {
    expect(finding.proof.trim().length).toBeGreaterThan(10);
  }
});
