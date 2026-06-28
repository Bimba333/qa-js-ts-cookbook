'use strict';

const Reporter = {
  environment: 'staging',
  report(testName) {
    console.log(`${this.environment}: ${testName}`);
  },
};

const report = Reporter.report;

try {
  report('login smoke');
} catch (error) {
  console.log(error.name);
  console.log('context lost');
}
