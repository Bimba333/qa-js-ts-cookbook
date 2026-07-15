export type ReportStatus = "passed" | "failed" | "skipped";

export type ReportSummary = {
  suiteName: string;
  status: ReportStatus;
  durationMs: number;
};

type InternalReportLine = {
  text: string;
  level: "info" | "warning";
};

function formatInternalLine(line: InternalReportLine): string {
  return `${line.level}: ${line.text}`;
}

const summary: ReportSummary = {
  suiteName: "login",
  status: "passed",
  durationMs: 1280,
};

console.log(formatInternalLine({ text: summary.suiteName, level: "info" }));
