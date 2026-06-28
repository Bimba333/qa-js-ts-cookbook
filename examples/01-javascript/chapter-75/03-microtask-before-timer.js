console.log('runner: start');

setTimeout(function uploadReport() {
  console.log('macrotask: upload report');
}, 0);

Promise.resolve().then(function notifyCompletion() {
  console.log('microtask: notify completion');
});

console.log('runner: finish current code');
