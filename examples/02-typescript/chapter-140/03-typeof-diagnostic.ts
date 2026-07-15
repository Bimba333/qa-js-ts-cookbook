export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
const status = "passed";
type Status = typeof status;

// @ts-expect-error Status is the literal type "passed".
const currentStatus: Status = "failed";

console.log(currentStatus);

