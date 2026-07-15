export {};

type ReportStatus =
  | { kind: "passed"; durationMs: number }
  | { kind: "failed"; message: string };

function describeStatus(status: ReportStatus): string {
  switch (status.kind) {
    case "passed":
      return `passed in ${status.durationMs}ms`;
    case "failed":
      return `failed: ${status.message}`;
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}

console.log(describeStatus({ kind: "passed", durationMs: 83 }));
