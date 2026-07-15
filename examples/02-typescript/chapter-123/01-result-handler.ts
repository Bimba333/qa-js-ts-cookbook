export {};

type ResultHandler = (message: string) => void;

function handleResult(message: string, handler: ResultHandler): void {
  handler(message);
}

handleResult('test passed', (message) => {
  console.log(message.toUpperCase());
});
