async function generateReport() {
  return 'report generated';
}

generateReport().then(function uploadReport(report) {
  console.log(`${report} and uploaded`);
});
