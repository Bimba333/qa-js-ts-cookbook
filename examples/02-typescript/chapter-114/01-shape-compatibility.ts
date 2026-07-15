interface Logger {
  log(message: string): void;
}

const consoleLike = {
  log(message: string): void {
    console.log(message);
  },
};

const logger: Logger = consoleLike;

logger.log('shape is compatible');
