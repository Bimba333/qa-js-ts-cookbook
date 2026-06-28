let currentReport = {
  testName: 'checkout test',
  status: 'failed',
  logs: ['open page', 'click checkout', 'assert error'],
};

console.log(`upload report: ${currentReport.testName}`);

currentReport = null;

console.log('report reference cleared after upload');
