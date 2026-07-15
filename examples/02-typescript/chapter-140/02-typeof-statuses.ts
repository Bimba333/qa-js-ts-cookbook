export {};

const testStatuses = {
  passed: "passed",
  failed: "failed",
  skipped: "skipped",
} as const;

type TestStatuses = typeof testStatuses;

const statuses: TestStatuses = {
  passed: "passed",
  failed: "failed",
  skipped: "skipped",
};

console.log(statuses.passed);

