export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
const retries = "2";

// @ts-expect-error conversion from string to number may be a mistake.
const retryCount = retries as number;

console.log(retryCount);
