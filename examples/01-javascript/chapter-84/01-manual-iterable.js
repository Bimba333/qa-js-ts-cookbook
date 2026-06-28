const testSuite = {
  tests: ['login', 'checkout'],
  [Symbol.iterator]() {
    let index = 0;
    const tests = this.tests;

    return {
      next() {
        if (index < tests.length) {
          return { value: tests[index++], done: false };
        }

        return { value: undefined, done: true };
      },
    };
  },
};

for (const test of testSuite) {
  console.log(test);
}
