const testCases = [
  'login smoke',
  'create order',
  'pay order',
  'logout smoke',
];

testCases.splice(2, 0, 'apply discount');

// state after splice mutation
console.log(testCases);
