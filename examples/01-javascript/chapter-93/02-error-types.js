function validateRetryCount(retryCount) {
  if (typeof retryCount !== 'number') {
    throw new TypeError('retryCount must be a number');
  }

  if (retryCount < 0 || retryCount > 5) {
    throw new RangeError('retryCount must be between 0 and 5');
  }

  return retryCount;
}

try {
  validateRetryCount(10);
} catch (error) {
  console.log(error.name);
  console.log(error.message);
}
