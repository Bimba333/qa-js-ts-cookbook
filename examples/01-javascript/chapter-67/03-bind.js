const Logger = {
  prefix: 'api',
  log(message) {
    console.log(`[${this.prefix}] ${message}`);
  },
};

const logApi = Logger.log.bind(Logger);

logApi('request started');
logApi('request finished');
