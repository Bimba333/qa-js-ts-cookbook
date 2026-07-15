export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE

enum ReportStatus {
  Passed = 'passed',
  Failed = 'failed',
}

const status: ReportStatus = ReportStatus.Passed;

// @ts-expect-error arbitrary string is not a ReportStatus value.
const wrongStatus: ReportStatus = 'passed';

console.log(status, wrongStatus);
