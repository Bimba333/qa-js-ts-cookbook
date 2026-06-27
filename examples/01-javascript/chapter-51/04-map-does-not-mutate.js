const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
];

const reportLines = testCases.map(function (testCase) {
  return `${testCase.id}: ${testCase.title}`;
});

console.log('Source:', testCases);
console.log('Mapped:', reportLines);
