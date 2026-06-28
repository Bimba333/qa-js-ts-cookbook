function* createTestCases() {
  yield 'login';
  yield 'checkout';
}

const tests = createTestCases();

console.log(tests.next());
console.log(tests.next());
console.log(tests.next());
