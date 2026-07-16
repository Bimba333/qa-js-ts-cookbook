import { expect as baseExpect, test } from "@playwright/test";

interface TaskSummary {
  id: string;
  status: "open" | "closed";
}

const expect = baseExpect.extend({
  toMatchTaskSummary(actual: TaskSummary, expected: TaskSummary) {
    const pass = actual.id === expected.id && actual.status === expected.status;
    return {
      pass,
      message: () => this.isNot
        ? `Задача не должна совпадать с ${JSON.stringify(expected)}, получена ${JSON.stringify(actual)}`
        : `Ожидалась задача ${JSON.stringify(expected)}, получена ${JSON.stringify(actual)}`,
    };
  },
});

test("объединяет domain assertion и soft checks", async ({}, testInfo) => {
  const actual: TaskSummary = { id: "task-223", status: "open" };
  const expected: TaskSummary = { id: "task-223", status: "open" };

  await testInfo.attach("task-summary", {
    body: JSON.stringify(actual, null, 2),
    contentType: "application/json",
  });
  expect.soft(actual.id).toBe("task-223");
  expect(actual).toMatchTaskSummary(expected);
  expect(actual).not.toMatchTaskSummary({ id: "task-other", status: "closed" });

  let positiveDiagnostic = "";
  try {
    expect(actual).toMatchTaskSummary({ id: "task-223", status: "closed" });
  } catch (error) {
    positiveDiagnostic = error instanceof Error ? error.message : String(error);
  }
  expect(positiveDiagnostic).toContain("Ожидалась задача");
  expect(positiveDiagnostic).toContain('"status":"closed"');
  expect(positiveDiagnostic).toContain('"status":"open"');

  let negatedDiagnostic = "";
  try {
    expect(actual).not.toMatchTaskSummary(expected);
  } catch (error) {
    negatedDiagnostic = error instanceof Error ? error.message : String(error);
  }
  expect(negatedDiagnostic).toContain("Задача не должна совпадать");
  expect(negatedDiagnostic).toContain('"id":"task-223"');
});
