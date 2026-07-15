export {};

class StepLogger {
  private steps: string[] = [];

  addStep(title: string): void {
    this.steps.push(title);
  }

  getCount(): number {
    return this.steps.length;
  }
}

const logger = new StepLogger();
logger.addStep("open page");
logger.addStep("submit form");

console.log(logger.getCount());
