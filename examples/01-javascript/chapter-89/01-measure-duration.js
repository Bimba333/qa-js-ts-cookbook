function runSuite(tests) {
  let totalDuration = 0;

  for (const test of tests) {
    totalDuration += test.durationMs;
  }

  return totalDuration;
}

const tests = [
  { id: 'T-1', durationMs: 120 },
  { id: 'T-2', durationMs: 340 },
  { id: 'T-3', durationMs: 90 },
];

const startedAt = Date.now();
const totalDuration = runSuite(tests);
const finishedAt = Date.now();

console.log(`test duration: ${totalDuration}`);
console.log(`calculation time: ${finishedAt - startedAt}`);
