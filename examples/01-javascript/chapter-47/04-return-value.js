const testCases = [
  'login smoke',
  'create order',
  'pay order',
  'logout smoke',
];

const removedTests = testCases.splice(1, 2, 'create paid order');

// state after splice mutation
console.log('Updated plan:', testCases);
console.log('Removed tests:', removedTests);
