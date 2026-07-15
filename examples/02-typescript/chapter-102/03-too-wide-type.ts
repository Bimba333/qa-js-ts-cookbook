// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE

let retryCount: number = 2;
retryCount = 3;

// @ts-expect-error TypeScript protects the numeric contract.
retryCount = 'three';

console.log(retryCount);
