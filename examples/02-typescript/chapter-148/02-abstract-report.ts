export {};

abstract class ReportWriter {
  abstract format: "text" | "json";

  writeHeader(title: string): string {
    return `Report: ${title}`;
  }

  abstract writeBody(items: string[]): string;
}

class TextReportWriter extends ReportWriter {
  format = "text" as const;

  writeBody(items: string[]): string {
    return items.join("\n");
  }
}

const writer = new TextReportWriter();

console.log(writer.writeHeader("Smoke"));
console.log(writer.writeBody(["passed", "failed"]));
