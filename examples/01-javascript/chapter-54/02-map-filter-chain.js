const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
  { id: 'T-3', title: 'pay order', status: 'passed', priority: 'medium' },
];

const failedLabels = testCases
  .map(function (testCase) {
    return {
      label: `${testCase.id}: ${testCase.title}`,
      status: testCase.status,
    };
  })
  .filter(function (testCase) {
    return testCase.status === 'failed';
  });

console.log(failedLabels);
