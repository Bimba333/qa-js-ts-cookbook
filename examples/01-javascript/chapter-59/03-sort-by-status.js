const testCases = [
  { id: 'T-3', title: 'pay order', status: 'passed', priority: 'medium' },
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-4', title: 'logout smoke', status: 'skipped', priority: 'low' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
];

const statusOrder = { failed: 1, skipped: 2, passed: 3 };

testCases.sort(function (firstTest, secondTest) {
  return statusOrder[firstTest.status] - statusOrder[secondTest.status];
});

console.log(testCases);
