export {};

type TestSummary = {
  status: "passed" | "failed";
};

function readSummary(value: unknown): TestSummary | undefined {
  if (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    (value.status === "passed" || value.status === "failed")
  ) {
    return value as TestSummary;
  }

  return undefined;
}

console.log(readSummary({ status: "passed" }));
