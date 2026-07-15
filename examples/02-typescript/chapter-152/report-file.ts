import { formatTitle } from "./format-title.js";

export function buildReportFile(title: string): string {
  return `${formatTitle(title).toLowerCase()}.json`;
}

