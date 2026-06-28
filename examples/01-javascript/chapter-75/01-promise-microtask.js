console.log('runner: start');

Promise.resolve().then(function validateResult() {
  console.log('microtask: validate result');
});

console.log('runner: finish current code');
