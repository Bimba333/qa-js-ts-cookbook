const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
  { id: 'T-3', title: 'pay order', status: 'passed', priority: 'medium' },
  { id: 'T-4', title: 'logout smoke', status: 'skipped', priority: 'low' },
];

const prioritySummary = testCases.reduce(function (accumulator, testCase) {
  accumulator[testCase.priority] = accumulator[testCase.priority] + 1;
  return accumulator;
}, { high: 0, medium: 0, low: 0 });

console.log(prioritySummary);
