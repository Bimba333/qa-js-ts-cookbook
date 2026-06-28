function createLogger(configuration) {
  return {
    prefix: 'api',
    log(message) {
      console.log(`${configuration.environment} [${this.prefix}] ${message}`);
    },
  };
}

const logger = createLogger({ environment: 'staging' });

logger.log('request started');
