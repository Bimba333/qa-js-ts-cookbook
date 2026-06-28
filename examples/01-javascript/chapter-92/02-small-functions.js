function createAssertionMessage(testTitle, status) {
  return `${testTitle}: ${status}`;
}

function assertPassed(testResult) {
  return testResult.status === 'passed';
}

const testResult = {
  title: 'profile updates',
  status: 'passed',
};

console.log(createAssertionMessage(testResult.title, testResult.status));
console.log(assertPassed(testResult));
