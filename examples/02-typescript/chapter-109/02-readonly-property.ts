// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE

const config: { readonly baseUrl: string; timeoutMs: number } = {
  baseUrl: 'https://api.example.test',
  timeoutMs: 5000,
};

config.timeoutMs = 7000;

// @ts-expect-error readonly property cannot be reassigned.
config.baseUrl = 'https://other.example.test';

console.log(config);
