const testCases = [
  { id: 'T-1', title: 'login works' },
  { id: 'T-2', title: 'checkout works' },
];

for (const testCase of testCases) {
  console.log(`${testCase.id}: ${testCase.title}`);
}
