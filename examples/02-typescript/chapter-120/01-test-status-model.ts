export {};

type TestStatus = 'passed' | 'failed' | 'skipped';

type TestResult = {
  title: string;
  status: TestStatus;
};

const result: TestResult = {
  title: 'login',
  status: 'passed',
};

console.log(result);
