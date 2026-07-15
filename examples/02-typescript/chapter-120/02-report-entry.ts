export {};

type TestBase = {
  title: string;
  durationMs: number;
};

type TestOutcome =
  | { status: 'passed' }
  | { status: 'failed'; errorMessage: string }
  | { status: 'skipped'; reason: string };

type ReportEntry = TestBase & TestOutcome;

const entry: ReportEntry = {
  title: 'checkout',
  durationMs: 300,
  status: 'failed',
  errorMessage: 'button is disabled',
};

console.log(entry);
