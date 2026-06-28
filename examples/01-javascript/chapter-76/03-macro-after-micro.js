console.log('runner: start');

setTimeout(function generateReport() {
  console.log('macrotask: generate report');
}, 0);

queueMicrotask(function saveResult() {
  console.log('microtask: save result');
});

Promise.resolve().then(function notifyCompletion() {
  console.log('microtask: notify completion');
});

console.log('runner: finish current code');
