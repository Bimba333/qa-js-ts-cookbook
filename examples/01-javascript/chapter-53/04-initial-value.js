const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
];

const report = testCases.reduce(function (accumulator, testCase) {
  return `${accumulator}${testCase.id}: ${testCase.status}\n`;
}, 'Test report:\n');

console.log(report);
