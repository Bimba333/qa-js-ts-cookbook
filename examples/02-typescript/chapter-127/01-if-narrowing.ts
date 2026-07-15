export {};

type TestStatus = "passed" | "failed";

function formatStatus(status: TestStatus): string {
  if (status === "passed") {
    return "ok";
  }

  return "not ok";
}

console.log(formatStatus("failed"));
