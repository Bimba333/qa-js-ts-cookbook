export {};

class ReportEntry {
  title: string;
  status: "passed" | "failed";

  constructor(title: string, status: "passed" | "failed") {
    this.title = title;
    this.status = status;
  }

  toLine(): string {
    return `${this.status}: ${this.title}`;
  }
}

function printEntry(entry: ReportEntry): void {
  console.log(entry.toLine());
}

printEntry(new ReportEntry("loads dashboard", "passed"));
