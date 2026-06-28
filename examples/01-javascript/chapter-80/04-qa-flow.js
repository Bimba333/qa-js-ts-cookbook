function collectLogs() {
  return Promise.resolve('logs collected');
}

function captureScreenshot() {
  return Promise.resolve('screenshot captured');
}

function uploadReport() {
  return Promise.resolve('report uploaded');
}

async function finishTestRun() {
  const artifacts = await Promise.all([collectLogs(), captureScreenshot()]);
  console.log(artifacts);

  const upload = await uploadReport();
  console.log(upload);
}

finishTestRun();
