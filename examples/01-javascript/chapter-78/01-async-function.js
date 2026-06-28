async function prepareEnvironment() {
  return { environment: 'staging' };
}

prepareEnvironment().then(function printConfiguration(configuration) {
  console.log(`${configuration.environment}: ready`);
});
