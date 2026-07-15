export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
type RetryPolicy = {
  maxAttempts: number;
  delayMs: number;
};

function shouldRetry(attempt: number, policy: RetryPolicy): boolean {
  return attempt < policy.maxAttempts;
}

const policy = {
  maxAttempts: 3,
  // @ts-expect-error delayMs обязателен для RetryPolicy.
} satisfies RetryPolicy;

console.log(policy.maxAttempts, shouldRetry);
