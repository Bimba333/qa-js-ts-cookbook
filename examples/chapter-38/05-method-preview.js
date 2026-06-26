const reporter = {
  log: function (message) {
    console.log('report:', message);
  }
};

const silentReporter = {};

reporter.log?.('test passed');
silentReporter.log?.('test skipped');
