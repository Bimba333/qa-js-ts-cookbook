export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
type Status = "passed" | "failed" | "skipped";
type FinalStatus = Exclude<Status, "skipped">;

// @ts-expect-error skipped was excluded from FinalStatus.
const status: FinalStatus = "skipped";

console.log(status);

