let reportStatus = 'not ready';

setTimeout(function createReport() {
  reportStatus = 'ready';
  console.log(`inside delayed operation: ${reportStatus}`);
}, 100);

console.log(`immediately after scheduling: ${reportStatus}`);
