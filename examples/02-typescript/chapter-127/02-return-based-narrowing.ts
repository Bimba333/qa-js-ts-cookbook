export {};

function formatError(message: string | undefined): string {
  if (message === undefined) {
    return "no error";
  }

  return message.toUpperCase();
}

console.log(formatError("timeout"));
console.log(formatError(undefined));
