const testCases = [
  { id: 'T-3', title: 'pay order', status: 'passed', priority: 'medium' },
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-4', title: 'logout smoke', status: 'skipped', priority: 'low' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
];

const priorityOrder = { high: 1, medium: 2, low: 3 };

testCases.sort(function (firstTest, secondTest) {
  return priorityOrder[firstTest.priority] - priorityOrder[secondTest.priority];
});

console.log(testCases);
