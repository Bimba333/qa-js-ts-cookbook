function runTestAndCreateReportLater() {
  console.log('test executed');

  setTimeout(function createReport() {
    console.log('report created after test runner finished current work');
  }, 100);
}

console.log('runner started');
runTestAndCreateReportLater();
console.log('runner can do other synchronous work');
