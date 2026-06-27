const testRun = [
  { id: 'T-1', title: 'login smoke' },
  { id: 'T-2', title: 'create order' },
  { id: 'T-3', title: 'pay order' },
];

for (const testCase of testRun) {
  console.log(`${testCase.id}: ${testCase.title}`);
}
