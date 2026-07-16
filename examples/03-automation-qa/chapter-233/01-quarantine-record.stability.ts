import { expect, test } from "@playwright/test";

interface QuarantineRecord {
  readonly testId: string;
  readonly evidence: readonly string[];
  readonly classification: "test-defect" | "product-defect" | "data-conflict" | "environment-instability";
  readonly reason: string;
  readonly contextFingerprint: string;
  readonly owner: string;
  readonly issueId: string;
  readonly expiresOn: string;
  readonly returnCriteria: string;
}

function hasText(value: string): boolean {
  return value.trim().length > 0;
}

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function approveQuarantine(record: QuarantineRecord): Readonly<QuarantineRecord> {
  if (
    record.evidence.length < 2 ||
    record.evidence.some((entry) => !hasText(entry)) ||
    !hasText(record.reason) ||
    !hasText(record.contextFingerprint) ||
    !hasText(record.owner) ||
    !hasText(record.issueId) ||
    !hasText(record.returnCriteria)
  ) {
    throw new Error("Quarantine требует причины, сопоставимого контекста, владельца и критерия возврата");
  }
  if (!isIsoDate(record.expiresOn)) throw new Error("Некорректный срок quarantine");
  return Object.freeze({ ...record, evidence: Object.freeze([...record.evidence]) });
}

test("создаёт временную quarantine с владельцем", async () => {
  const record = approveQuarantine({
    testId: "TASK-233",
    evidence: ["run-1 failed", "run-2 passed"],
    classification: "data-conflict",
    reason: "два сценария используют одну запись заказа",
    contextFingerprint: "project=chromium;config=local;seed=17;data=order-42",
    owner: "payments-qa",
    issueId: "QA-233",
    expiresOn: "2026-08-01",
    returnCriteria: "20 сопоставимых passing runs после исправления",
  });
  expect(record.owner).toBe("payments-qa");
  expect(record.reason).toContain("одну запись");
  expect(record.contextFingerprint).toContain("seed=17");
  expect(record.returnCriteria).toContain("после исправления");
});
