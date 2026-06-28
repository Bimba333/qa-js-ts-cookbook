const manualSuite = {
  tests: ['login'],
  [Symbol.iterator]() {
    return this.tests[Symbol.iterator]();
  },
};

const generatorSuite = {
  tests: ['checkout'],
  *[Symbol.iterator]() {
    yield this.tests[0];
  },
};

for (const test of manualSuite) {
  console.log(`manual: ${test}`);
}

for (const test of generatorSuite) {
  console.log(`generator: ${test}`);
}
