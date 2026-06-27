const testCases = [
  'login smoke',
  'deprecated checkout',
  'pay order',
  'logout smoke',
];

const removedTests = testCases.splice(1, 1);

// state after splice mutation
console.log(testCases);
console.log(removedTests);
