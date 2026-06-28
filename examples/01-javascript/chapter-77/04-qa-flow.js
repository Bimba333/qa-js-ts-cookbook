function executeTest() {
  return Promise.resolve({ testName: 'login smoke', status: 'passed' });
}

executeTest()
  .then(function generateReport(result) {
    console.log(`${result.testName}: ${result.status}`);
    return 'report generated';
  })
  .then(function uploadReport(reportStatus) {
    console.log(reportStatus);
  })
  .catch(function handleError(error) {
    console.log(`error: ${error}`);
  })
  .finally(function cleanup() {
    console.log('cleanup finished');
  });
