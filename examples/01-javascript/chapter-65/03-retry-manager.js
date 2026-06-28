function createRetryManager(maxRetries) {
  let attempt = 0;

  return function nextAttempt() {
    attempt += 1;
    return attempt <= maxRetries;
  };
}

const shouldRetry = createRetryManager(2);

console.log(shouldRetry());
console.log(shouldRetry());
console.log(shouldRetry());
