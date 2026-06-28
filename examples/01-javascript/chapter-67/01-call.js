const Reporter = {
  environment: 'staging',
  report(testName, status) {
    console.log(`${this.environment}: ${testName} -> ${status}`);
  },
};

const report = Reporter.report;

report.call(Reporter, 'login smoke', 'passed');
