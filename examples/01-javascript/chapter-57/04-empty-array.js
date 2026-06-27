const testCases = [];

const allPassed = testCases.every(function (testCase) {
  return testCase.status === 'passed';
});

console.log(allPassed);
