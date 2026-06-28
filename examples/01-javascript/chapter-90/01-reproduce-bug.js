function getFailedTests(results) {
  return results.filter((result) => result.status === 'failed');
}

const testResults = [
  { id: 'T-1', status: 'passed' },
  { id: 'T-2', status: 'fail' },
];

console.log(getFailedTests(testResults));
