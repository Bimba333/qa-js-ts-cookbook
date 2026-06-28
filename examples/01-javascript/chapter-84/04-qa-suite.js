const smokeSuite = {
  name: 'smoke',
  owner: 'qa-team',
  tests: [
    { id: 'T-1', title: 'login works' },
    { id: 'T-2', title: 'checkout works' },
  ],
  *[Symbol.iterator]() {
    for (const test of this.tests) {
      yield test;
    }
  },
};

for (const test of smokeSuite) {
  console.log(`${smokeSuite.name}: ${test.id} ${test.title}`);
}
