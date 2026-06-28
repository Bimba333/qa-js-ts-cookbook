const logBuffer = [];

function saveLog(testName, messages) {
  logBuffer.push({
    testName,
    messages,
  });
}

saveLog('login test', ['start', 'finish']);
saveLog('checkout test', ['start', 'error']);

console.log(logBuffer.length);
