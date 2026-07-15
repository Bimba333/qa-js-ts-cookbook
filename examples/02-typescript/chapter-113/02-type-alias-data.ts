type ReportConfig = {
  title: string;
  outputDir: string;
};

const config: ReportConfig = {
  title: 'smoke',
  outputDir: 'reports/smoke',
};

console.log(config.outputDir);
