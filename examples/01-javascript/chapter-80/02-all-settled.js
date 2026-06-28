function collectLogs() {
  return Promise.resolve('logs collected');
}

function captureScreenshot() {
  return Promise.reject('screenshot failed');
}

Promise.allSettled([collectLogs(), captureScreenshot()]).then(function printResults(results) {
  console.log(results.map(function getStatus(result) {
    return result.status;
  }));
});
