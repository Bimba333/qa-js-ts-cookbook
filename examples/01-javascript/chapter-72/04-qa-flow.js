function runTest(testName) {
  return new Promise(function resolveTest(resolve) {
    setTimeout(function finishTest() {
      resolve({ testName, status: 'passed' });
    }, 100);
  });
}

runTest('login smoke').then(function printResult(result) {
  console.log(`${result.testName}: ${result.status}`);
});
