function createRetryManager(maxRetries) {
  let attempt = 0;

  return {
    shouldRetry() {
      attempt += 1;
      return attempt <= maxRetries;
    },
  };
}

const RetryManager = createRetryManager(2);

console.log(RetryManager.shouldRetry());
console.log(RetryManager.shouldRetry());
console.log(RetryManager.shouldRetry());
