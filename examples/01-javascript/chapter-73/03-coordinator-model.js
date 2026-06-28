function prepareEnvironment() {
  console.log('environment: prepared');
}

console.log('runner: start');

setTimeout(function generateReport() {
  console.log('report: generated later');
}, 0);

Promise.resolve().then(function notifyCompletion() {
  console.log('notification: sent before timer');
});

prepareEnvironment();

console.log('runner: synchronous work done');
