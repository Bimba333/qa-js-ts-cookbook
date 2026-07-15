import type { ReportWriter } from "./report-writer.js";

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
function useWriter(writer: ReportWriter): string {
  return writer.write("passed");
}

// @ts-expect-error ReportWriter импортирован только как тип, поэтому его нельзя создать через new.
const writer = new ReportWriter();

console.log(useWriter(writer));
