export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE

const config = {
  environment: 'staging',
  retries: 2,
} as const;

// @ts-expect-error as const makes the property readonly for TypeScript.
config.retries = 3;

console.log(config);
