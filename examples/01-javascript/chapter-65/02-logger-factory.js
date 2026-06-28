function createLogger(configuration) {
  return function log(message) {
    console.log(`[${configuration.environment}] ${message}`);
  };
}

const configuration = {
  environment: 'staging',
};

const log = createLogger(configuration);

log('start test');
log('finish test');
