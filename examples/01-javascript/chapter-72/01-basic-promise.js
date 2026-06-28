function createReport() {
  return new Promise(function resolveReport(resolve) {
    setTimeout(function finishReport() {
      resolve('login smoke: report generated');
    }, 100);
  });
}

createReport().then(function printReport(report) {
  console.log(report);
});
