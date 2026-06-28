function collectLogs() {
  return Promise.reject('logs are not available');
}

async function generateReport() {
  const logs = await collectLogs();
  return `report with ${logs}`;
}

generateReport().catch(function handleReportError(error) {
  console.log(`report error: ${error}`);
});
