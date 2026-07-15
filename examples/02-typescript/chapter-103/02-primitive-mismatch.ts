// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE

const retries: number = 2;

// @ts-expect-error A string is not a number.
const invalidRetries: number = '2';

console.log(retries, invalidRetries);
