let currentReport = {
  testName: 'checkout test',
  status: 'failed',
};

console.log(currentReport.status);

currentReport = null;

console.log('old report is no longer reachable through currentReport');
