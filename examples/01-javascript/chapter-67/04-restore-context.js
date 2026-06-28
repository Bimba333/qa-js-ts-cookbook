'use strict';

const Reporter = {
  environment: 'staging',
  report(testName, status) {
    console.log(`${this.environment}: ${testName} -> ${status}`);
  },
};

function runTest(testName, status, reportResult) {
  reportResult(testName, status);
}

const safeReport = Reporter.report.bind(Reporter);

runTest('login smoke', 'passed', safeReport);
