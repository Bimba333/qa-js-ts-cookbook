const runner = {
  currentReport: {
    testName: 'api test',
    logs: ['request sent', 'response received'],
  },
  config: {
    environment: 'staging',
  },
};

console.log(runner.currentReport.logs[0]);
console.log(runner.config.environment);
