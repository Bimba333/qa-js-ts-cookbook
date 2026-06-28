console.log('framework: run test');

setTimeout(function generateReport() {
  console.log('macrotask: generate report');
}, 0);

queueMicrotask(function saveResult() {
  console.log('microtask: save result before report generation');
});

console.log('framework: current execution finished');
