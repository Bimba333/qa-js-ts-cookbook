const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
];

const result = testCases.some(function (testCase) {
  testCase.status === 'failed';
});

console.log(result);
