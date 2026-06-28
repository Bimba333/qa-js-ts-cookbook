const testResults = [
  { id: 'T-1', title: 'login works', durationMs: 320 },
  { id: 'T-2', title: 'checkout creates order', durationMs: 1250 },
  { id: 'T-3', title: 'profile updates', durationMs: 410 },
  { id: 'T-4', title: 'report export', durationMs: 1840 },
];

const slowTests = testResults.filter((test) => test.durationMs > 1000);

console.log('slow tests:');

for (const test of slowTests) {
  console.log(`${test.id}: ${test.title} (${test.durationMs}ms)`);
}
