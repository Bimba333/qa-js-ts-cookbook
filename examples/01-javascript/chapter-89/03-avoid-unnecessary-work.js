const testCases = [
  { id: 'T-1', status: 'passed', priority: 'low' },
  { id: 'T-2', status: 'failed', priority: 'high' },
  { id: 'T-3', status: 'passed', priority: 'medium' },
];

function getTestsForRerun(tests) {
  return tests.filter((test) => {
    const isFailed = test.status === 'failed';
    const isImportant = test.priority === 'high';

    return isFailed && isImportant;
  });
}

console.log(getTestsForRerun(testCases));
