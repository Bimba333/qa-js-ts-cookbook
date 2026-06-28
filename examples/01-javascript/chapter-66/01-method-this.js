const Logger = {
  prefix: 'smoke',
  log(message) {
    console.log(`[${this.prefix}] ${message}`);
  },
};

Logger.log('start test');
