export function createReport(testName, passed) {
  return {
    testName,
    status: passed ? 'passed' : 'failed',
  };
}
