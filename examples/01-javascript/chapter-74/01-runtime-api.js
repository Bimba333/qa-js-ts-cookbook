console.log('javascript: schedule report generation');

setTimeout(function generateReport() {
  console.log('runtime: report generation completed');
}, 100);

console.log('javascript: continue running current code');
