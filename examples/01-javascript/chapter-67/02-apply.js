const Reporter = {
  environment: 'staging',
  report(testName, status) {
    console.log(`${this.environment}: ${testName} -> ${status}`);
  },
};

const report = Reporter.report;
const reportArguments = ['create order', 'failed'];

report.apply(Reporter, reportArguments);
