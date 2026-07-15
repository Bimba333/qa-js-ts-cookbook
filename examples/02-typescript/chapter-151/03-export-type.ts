import type { ReportItem } from "./report-types.js";

function formatItem(item: ReportItem): string {
  return `${item.status}: ${item.title}`;
}

console.log(formatItem({ title: "checkout", status: "passed" }));

