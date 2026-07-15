export {};

type TestInfo = {
  title: string;
};

type WithDuration = {
  durationMs: number;
};

type ReportEntry = TestInfo & WithDuration;

const entry: ReportEntry = {
  title: 'login',
  durationMs: 120,
};

console.log(entry);
