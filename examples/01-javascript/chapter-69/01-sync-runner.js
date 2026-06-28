const testRun = [];

function prepareEnvironment() {
  testRun.push('environment prepared');
}

function runTest() {
  testRun.push('login test executed');
}

function createReport() {
  testRun.push('report created');
}

prepareEnvironment();
runTest();
createReport();

console.log(testRun);
