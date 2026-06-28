function prepareEnvironment() {
  return new Promise(function resolveEnvironment(resolve) {
    setTimeout(function finishPreparation() {
      resolve({ environment: 'staging' });
    }, 100);
  });
}

prepareEnvironment().then(function runTest(configuration) {
  console.log(`${configuration.environment}: login smoke passed`);
});
