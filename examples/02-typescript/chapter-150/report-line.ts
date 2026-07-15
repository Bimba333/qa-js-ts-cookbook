export type ReportStatus = "passed" | "failed";

export function createReportLine(title: string, status: ReportStatus): string {
  return `${status}: ${title}`;
}

