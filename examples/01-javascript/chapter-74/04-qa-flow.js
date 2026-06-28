function uploadReportLater(reportName) {
  setTimeout(function uploadReport() {
    console.log(`${reportName}: uploaded by runtime callback`);
  }, 100);
}

console.log('framework: generate report');
uploadReportLater('smoke-report');
console.log('framework: continue after scheduling upload');
