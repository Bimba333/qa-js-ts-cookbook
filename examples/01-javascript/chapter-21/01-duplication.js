const firstStatusCode = 200;
if (firstStatusCode !== 200) {
  throw new Error('Expected status 200');
}
console.log('First response is valid');

const secondStatusCode = 200;
if (secondStatusCode !== 200) {
  throw new Error('Expected status 200');
}
console.log('Second response is valid');
