const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
  { id: 'T-3', title: 'pay order', status: 'passed', priority: 'medium' },
];

const failedTests = testCases.filter(function (testCase) {
  return testCase.status === 'failed';
});

const failedReportLines = failedTests.map(function (testCase) {
  return `${testCase.id}: ${testCase.title}`;
});

console.log(failedReportLines);
