interface BaseReport {
  title: string;
}

interface DetailedReport extends BaseReport {
  failedCount: number;
}

const report: DetailedReport = {
  title: 'smoke',
  failedCount: 0,
};

console.log(`${report.title}: ${report.failedCount}`);
