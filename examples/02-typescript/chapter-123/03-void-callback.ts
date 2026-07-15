export {};

type LogHandler = (message: string) => void;

function writeLog(message: string, handler: LogHandler): void {
  handler(message);
}

writeLog('setup complete', (message) => {
  console.log(message);
  return message.length;
});
