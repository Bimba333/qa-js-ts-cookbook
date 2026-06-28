console.log('test started');

setTimeout(function generateReport() {
  console.log('report generated later');
}, 100);

console.log('test function finished');
