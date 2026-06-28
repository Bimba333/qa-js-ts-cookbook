function prepareEnvironment() {
  return Promise.resolve({ environment: 'staging' });
}

prepareEnvironment().then(function runLogin(configuration) {
  console.log(`${configuration.environment}: login prepared`);
});
