function createFramework(configuration) {
  function log(message) {
    console.log(`[${configuration.environment}] ${message}`);
  }

  return {
    log,
  };
}

const framework = createFramework({ environment: 'staging' });

framework.log('framework started');
