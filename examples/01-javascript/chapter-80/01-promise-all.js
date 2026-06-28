function collectLogs() {
  return Promise.resolve('logs collected');
}

function captureScreenshot() {
  return Promise.resolve('screenshot captured');
}

Promise.all([collectLogs(), captureScreenshot()]).then(function printResults(results) {
  console.log(results);
});
