import { expect, test } from "@playwright/test";

type RunStatus = "passed" | "assertion-failed" | "infrastructure-failed";
type RunEvidence = {
  readonly context: string;
  readonly status: RunStatus;
};
type Classification =
  | "deterministic-pass"
  | "deterministic-failure"
  | "instability-signal"
  | "flaky-pattern"
  | "infrastructure-failure"
  | "insufficient-evidence";

function classifyRuns(runs: readonly RunEvidence[]): Classification {
  if (runs.some((run) => run.status === "infrastructure-failed")) return "infrastructure-failure";
  if (runs.length < 2 || new Set(runs.map((run) => run.context)).size !== 1) return "insufficient-evidence";
  if (runs.every((run) => run.status === "passed")) return "deterministic-pass";
  if (runs.every((run) => run.status === "assertion-failed")) return "deterministic-failure";
  if (runs.length < 3) return "instability-signal";
  return "flaky-pattern";
}

test("классифицирует только сопоставимую серию запусков", async () => {
  const run = (status: RunStatus, context = "local-chromium-seed-17"): RunEvidence => ({ context, status });

  expect(classifyRuns([run("assertion-failed")])).toBe("insufficient-evidence");
  expect(classifyRuns([run("assertion-failed"), run("passed", "different-context")])).toBe(
    "insufficient-evidence",
  );
  expect(classifyRuns([run("infrastructure-failed"), run("passed")])).toBe("infrastructure-failure");
  expect(classifyRuns([run("assertion-failed"), run("assertion-failed")])).toBe("deterministic-failure");
  expect(classifyRuns([run("assertion-failed"), run("passed")])).toBe("instability-signal");
  expect(classifyRuns([run("assertion-failed"), run("passed"), run("assertion-failed")])).toBe(
    "flaky-pattern",
  );
});
