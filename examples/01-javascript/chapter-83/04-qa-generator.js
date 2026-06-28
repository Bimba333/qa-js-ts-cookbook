function* failedTestReport() {
  yield { type: 'log', name: 'browser.log' };
  yield { type: 'screenshot', name: 'failure.png' };
  yield { type: 'trace', name: 'trace.zip' };
}

for (const entry of failedTestReport()) {
  console.log(`${entry.type}: ${entry.name}`);
}
