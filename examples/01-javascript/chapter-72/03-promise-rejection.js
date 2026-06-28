function generateReport(testName) {
  return new Promise(function createFutureReport(resolve, reject) {
    setTimeout(function finishGeneration() {
      if (!testName) {
        reject('test name is required');
        return;
      }

      resolve(`${testName}: report generated`);
    }, 100);
  });
}

generateReport('').catch(function handleError(error) {
  console.log(`error: ${error}`);
});
