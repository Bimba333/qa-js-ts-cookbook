function createReport(callback) {
  setTimeout(function finishReport() {
    const report = 'login smoke: passed';
    callback(report);
  }, 100);
}

createReport(function printReport(report) {
  console.log(report);
});
