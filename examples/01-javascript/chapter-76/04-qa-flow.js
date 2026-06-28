console.log('framework: execute tests');

setTimeout(function uploadReport() {
  console.log('macrotask: upload report');
}, 0);

Promise.resolve().then(function markRunFinished() {
  console.log('microtask: mark run finished');
});

setTimeout(function notifyDashboard() {
  console.log('macrotask: notify dashboard');
}, 0);

console.log('framework: synchronous part complete');
