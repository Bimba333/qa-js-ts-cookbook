function createMessageReader() {
  const message = 'Environment is reachable';

  return function readMessage() {
    return message;
  };
}

const readMessage = createMessageReader();

console.log(readMessage());
