console.log('console is provided by the runtime');

setTimeout(function uploadReport() {
  console.log('setTimeout is also provided by the runtime');
}, 0);

Promise.resolve().then(function markTestFinished() {
  console.log('Promise is a JavaScript object, but its callback is scheduled');
});
