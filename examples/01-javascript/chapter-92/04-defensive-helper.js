function createTestId(prefix, number) {
  if (!prefix) {
    throw new Error('prefix is required');
  }

  if (number <= 0) {
    throw new Error('number must be positive');
  }

  return `${prefix}-${number}`;
}

console.log(createTestId('T', 42));
