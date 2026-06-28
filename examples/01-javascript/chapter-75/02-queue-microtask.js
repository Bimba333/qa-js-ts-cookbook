console.log('framework: execute test');

queueMicrotask(function saveResult() {
  console.log('microtask: save test result');
});

console.log('framework: current code done');
