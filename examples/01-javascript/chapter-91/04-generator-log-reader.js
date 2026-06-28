function* readLogs(logs) {
  for (const log of logs) {
    yield `[${log.level}] ${log.message}`;
  }
}

const logs = [
  { level: 'info', message: 'test started' },
  { level: 'info', message: 'page opened' },
  { level: 'error', message: 'assertion failed' },
];

for (const line of readLogs(logs)) {
  console.log(line);
}
