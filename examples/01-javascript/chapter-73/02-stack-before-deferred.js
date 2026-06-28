function executeTest() {
  console.log('test: executed');
}

console.log('runner: start');

setTimeout(function uploadReport() {
  console.log('report: uploaded');
}, 0);

executeTest();

console.log('runner: current stack finished');
