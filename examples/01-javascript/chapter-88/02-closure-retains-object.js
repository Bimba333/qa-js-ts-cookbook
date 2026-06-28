function createReporter() {
  const report = {
    testName: 'api test',
    logs: ['request', 'response'],
  };

  return function printReport() {
    console.log(`${report.testName}: ${report.logs.length} logs`);
  };
}

const printReport = createReporter();

printReport();
