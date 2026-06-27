class BaseReporter {
  label(message) {
    return `${this.prefix}: ${message}`;
  }
}

class TestReporter extends BaseReporter {
  label(message) {
    const baseLabel = super.label(message);
    return `${baseLabel} [test run]`;
  }
}

const reporter = new TestReporter();
reporter.prefix = 'QA';

console.log(reporter.label('failed assertion'));
