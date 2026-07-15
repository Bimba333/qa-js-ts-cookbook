interface StepLogger {
  log(message: string): void;
}

function runStep(logger: StepLogger): void {
  logger.log('open checkout page');
}

const fileLogger = {
  log(message: string): void {
    console.log(`[file] ${message}`);
  },
};

runStep(fileLogger);
