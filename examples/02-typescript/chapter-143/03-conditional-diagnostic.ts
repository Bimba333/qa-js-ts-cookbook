export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
type AssertionLabel<Result> = Result extends { passed: true }
  ? "passed"
  : "failed";

type FailedLabel = AssertionLabel<{ passed: false }>;

// @ts-expect-error FailedLabel is "failed".
const label: FailedLabel = "passed";

console.log(label);

