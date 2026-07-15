export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE

const environment: 'staging' = 'staging';

// @ts-expect-error environment must be exactly staging.
const wrongEnvironment: 'staging' = 'production';

console.log(environment, wrongEnvironment);
