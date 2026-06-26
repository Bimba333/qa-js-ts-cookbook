const assertionHelper = {
  suite: 'smoke',
  formatStatus(testName, actualStatus, expectedStatus) {
    const passed = actualStatus === expectedStatus;

    return this.suite + ': ' + testName + ' -> ' + passed;
  }
};

console.log(assertionHelper.formatStatus('login', 200, 200));
console.log(assertionHelper.formatStatus('checkout', 500, 200));
