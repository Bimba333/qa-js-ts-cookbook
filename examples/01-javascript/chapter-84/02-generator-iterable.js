const testSuite = {
  tests: ['login', 'checkout', 'report'],
  *[Symbol.iterator]() {
    for (const test of this.tests) {
      yield test;
    }
  },
};

for (const test of testSuite) {
  console.log(test);
}
