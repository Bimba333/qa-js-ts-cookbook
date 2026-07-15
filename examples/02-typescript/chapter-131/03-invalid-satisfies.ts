export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
type EnvironmentConfig = {
  baseUrl: string;
  retries: number;
};

// @ts-expect-error retries must be a number.
const config = { baseUrl: "https://service.local", retries: "2" } satisfies EnvironmentConfig;

console.log(config);
