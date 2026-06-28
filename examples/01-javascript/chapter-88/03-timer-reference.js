const logBuffer = ['first log', 'second log'];

const timerId = setTimeout(function printLogs() {
  console.log(`logs: ${logBuffer.length}`);
}, 10);

console.log(`timer scheduled: ${timerId !== undefined}`);
