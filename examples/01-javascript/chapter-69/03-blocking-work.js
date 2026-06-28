function runSlowPreparation() {
  const startedAt = Date.now();

  while (Date.now() - startedAt < 100) {
    // Simulates synchronous preparation work.
  }

  console.log('environment prepared');
}

console.log('before preparation');
runSlowPreparation();
console.log('after preparation');
