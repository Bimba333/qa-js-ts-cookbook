function generateReport(testName, callback) {
  setTimeout(function finishGeneration() {
    if (!testName) {
      callback('test name is required', null);
      return;
    }

    callback(null, `${testName}: report generated`);
  }, 100);
}

generateReport('login smoke', function handleReport(error, report) {
  if (error) {
    console.log(`error: ${error}`);
    return;
  }

  console.log(report);
});
