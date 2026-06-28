console.log('runner: start');

setTimeout(function generateReport() {
  console.log('report: generated');
}, 0);

Promise.resolve().then(function notifyCompletion() {
  console.log('notification: completion scheduled');
});

console.log('runner: finish current code');
