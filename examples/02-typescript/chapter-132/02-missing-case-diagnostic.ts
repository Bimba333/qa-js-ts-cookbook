export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
type ReportStatus =
  | { kind: "passed"; durationMs: number }
  | { kind: "failed"; message: string }
  | { kind: "skipped"; reason: string };

function describeStatus(status: ReportStatus): string {
  switch (status.kind) {
    case "passed":
      return `passed in ${status.durationMs}ms`;
    case "failed":
      return `failed: ${status.message}`;
    default: {
      // @ts-expect-error skipped is not handled, so status is not never.
      const exhaustive: never = status;
      return "unknown";
    }
  }
}

console.log(describeStatus({ kind: "skipped", reason: "disabled" }));
