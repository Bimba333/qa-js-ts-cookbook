function runTest(testName, callback) {
  setTimeout(function finishTest() {
    const result = { testName, status: 'passed' };
    callback(result);
  }, 100);
}

runTest('login smoke', function saveResult(result) {
  console.log(`${result.testName}: ${result.status}`);
});
