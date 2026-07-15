interface Logger {
  log(message: string): void;
}

const logger: Logger = {
  log(message: string): void {
    console.log(message);
  },
};

logger.log('ready');
