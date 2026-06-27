const testCases = [
  'login smoke',
  'create order',
  'old payment check',
  'logout smoke',
];

const removedTests = testCases.splice(2, 1, 'pay order');

// state after splice mutation
console.log(testCases);
console.log(removedTests);
