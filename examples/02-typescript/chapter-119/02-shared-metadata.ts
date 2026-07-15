export {};

type TestResult = {
  title: string;
  status: 'passed';
};

type WithMetadata = {
  owner: string;
  suite: string;
};

type ResultWithMetadata = TestResult & WithMetadata;

const result: ResultWithMetadata = {
  title: 'checkout',
  status: 'passed',
  owner: 'qa',
  suite: 'smoke',
};

console.log(result);
