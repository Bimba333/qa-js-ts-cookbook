function createFramework(configuration) {
  const Logger = {
    prefix: 'runner',
    log(message) {
      console.log(`${configuration.environment} [${this.prefix}] ${message}`);
    },
  };

  const Reporter = {
    name: 'console reporter',
    report(testName, status) {
      console.log(`${this.name}: ${testName} -> ${status}`);
    },
  };

  const log = Logger.log.bind(Logger);
  const report = Reporter.report.bind(Reporter);

  return {
    runTest(testName, status) {
      log(`start ${testName}`);
      report(testName, status);
      log(`finish ${testName}`);
    },
  };
}

const TestRunner = createFramework({ environment: 'staging' });

TestRunner.runTest('login smoke', 'passed');
