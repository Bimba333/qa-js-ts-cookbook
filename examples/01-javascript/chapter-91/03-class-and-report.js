class TestReport {
  constructor(title) {
    this.title = title;
    this.steps = [];
  }

  addStep(stepName, status) {
    this.steps.push({ stepName, status });
  }

  getSummary() {
    return {
      title: this.title,
      totalSteps: this.steps.length,
    };
  }
}

const report = new TestReport('login test');

report.addStep('open page', 'passed');
report.addStep('submit form', 'passed');

console.log(report.getSummary());
