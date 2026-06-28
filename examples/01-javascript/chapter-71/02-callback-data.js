function prepareEnvironment(callback) {
  setTimeout(function finishPreparation() {
    const configuration = { environment: 'staging' };
    callback(configuration);
  }, 100);
}

prepareEnvironment(function runTest(configuration) {
  console.log(`${configuration.environment}: login smoke passed`);
});
