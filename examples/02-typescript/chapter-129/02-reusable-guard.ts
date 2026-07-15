export {};

type TestResult = {
  status: "passed" | "failed";
  durationMs: number;
};

function isTestResult(value: unknown): value is TestResult {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  return (
    "status" in value &&
    (value.status === "passed" || value.status === "failed") &&
    "durationMs" in value &&
    typeof value.durationMs === "number"
  );
}

function formatResult(value: unknown): string {
  if (!isTestResult(value)) {
    return "unknown result";
  }

  return `${value.status}: ${value.durationMs}ms`;
}

console.log(formatResult({ status: "passed", durationMs: 120 }));
