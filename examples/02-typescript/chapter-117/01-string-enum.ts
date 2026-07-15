export {};

enum TestStatus {
  Passed = 'passed',
  Failed = 'failed',
}

const status: TestStatus = TestStatus.Passed;

console.log(status);
