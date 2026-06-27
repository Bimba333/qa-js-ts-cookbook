const testRun = [
  { id: 'T-1', title: 'login smoke' },
  { id: 'T-2', title: 'create order' },
  { id: 'T-3', title: 'pay order' },
];

testRun.forEach(function (testCase) {
  console.log(`Register ${testCase.id}: ${testCase.title}`);
});
