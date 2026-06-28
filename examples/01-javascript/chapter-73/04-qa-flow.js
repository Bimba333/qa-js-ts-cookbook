console.log('framework: read configuration');

setTimeout(function uploadReport() {
  console.log('framework: upload report');
}, 0);

Promise.resolve().then(function notifyCompletion() {
  console.log('framework: notify completion');
});

console.log('framework: execute test');
