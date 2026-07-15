export {};

type ReportFormatter = {
  format(status: 'passed' | 'failed'): string;
};

const formatter: ReportFormatter = {
  format(status) {
    return `report status: ${status}`;
  },
};

console.log(formatter.format('passed'));
