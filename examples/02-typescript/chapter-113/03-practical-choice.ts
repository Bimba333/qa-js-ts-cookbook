interface Writer {
  write(message: string): void;
}

type ReportData = {
  title: string;
  passed: boolean;
};

function writeReport(writer: Writer, data: ReportData): void {
  writer.write(`${data.title}: ${data.passed}`);
}

const consoleWriter: Writer = {
  write(message: string): void {
    console.log(message);
  },
};

writeReport(consoleWriter, { title: 'api smoke', passed: true });
