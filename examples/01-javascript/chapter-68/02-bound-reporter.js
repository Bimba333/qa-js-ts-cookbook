const Reporter = {
  name: 'console reporter',
  report(testName, status) {
    console.log(`${this.name}: ${testName} -> ${status}`);
  },
};

function runTest(reportResult) {
  reportResult('login smoke', 'passed');
}

const reportResult = Reporter.report.bind(Reporter);

runTest(reportResult);
