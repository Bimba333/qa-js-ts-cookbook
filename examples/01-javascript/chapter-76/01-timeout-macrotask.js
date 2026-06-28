console.log('runner: start');

setTimeout(function generateReport() {
  console.log('macrotask: generate report');
}, 0);

console.log('runner: finish current code');
