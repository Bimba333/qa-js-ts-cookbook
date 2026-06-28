function createReport(testResult) {
  return {
    title: testResult.title,
    status: testResult.status,
  };
}

const renamedResult = {
  name: 'login test',
  status: 'passed',
};

console.log(createReport(renamedResult));
