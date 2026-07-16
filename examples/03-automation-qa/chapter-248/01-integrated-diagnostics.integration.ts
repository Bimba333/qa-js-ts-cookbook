import { expect, test } from "../support/integration/fixtures.js";
import { TaskScenario } from "../support/integration/task-scenario.js";

test("связывает ошибку сценария с bounded diagnostic event", async ({ framework }) => {
  const id = "task-248";
  await framework.api.create({ id, title: "Existing" });
  framework.registerOwnedTask(id);

  await expect(framework.tasks.createCloseAndVerify(id, "Duplicate")).rejects.toThrow(
    `Не удалось выполнить сценарий для ${id}`,
  );

  const entries = framework.diagnosticEntries();
  expect(entries).toHaveLength(1);
  expect(JSON.parse(entries[0] ?? "null")).toEqual(expect.objectContaining({
    event: expect.objectContaining({
      event: "task.scenario.failed",
      fields: { taskId: id },
    }),
  }));
  expect(entries[0]).not.toContain("test-only-token");

  const primaryError = new Error("adapter failed");
  const diagnosticError = new Error("diagnostic sink failed");
  const scenarioWithBrokenDiagnostics = new TaskScenario(
    { create: async () => { throw primaryError; } },
    { get: async () => { throw new Error("unexpected read"); } },
    { close: async () => { throw new Error("unexpected edit"); } },
    { find: async () => null, remove: async () => undefined },
    { write: async () => { throw diagnosticError; } },
    "diagnostic-failure-check",
    () => { throw new Error("unexpected ownership registration"); },
  );

  const combinedFailure = await scenarioWithBrokenDiagnostics
    .createCloseAndVerify("task-diagnostic-failure", "Failure")
    .catch((error: unknown) => error);

  expect(combinedFailure).toBeInstanceOf(AggregateError);
  if (!(combinedFailure instanceof AggregateError)) {
    throw new Error("Ожидался AggregateError сценария и diagnostics");
  }
  const errors = combinedFailure.errors;
  expect(errors[0]).toMatchObject({ cause: primaryError });
  expect(errors[1]).toBe(diagnosticError);
});
