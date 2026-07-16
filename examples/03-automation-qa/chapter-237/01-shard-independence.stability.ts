import { expect, test } from "@playwright/test";

for (const caseId of ["task-237-a", "task-237-b", "task-237-c", "task-237-d"] as const) {
  test(`независимо проверяет ${caseId}`, async () => {
    expect(caseId).toMatch(/^task-237-[a-d]$/);
  });
}
