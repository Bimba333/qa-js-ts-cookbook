function prepareEnvironment() {
  console.log('javascript: ask runtime to wait');

  setTimeout(function environmentReady() {
    console.log('runtime callback: environment ready');
  }, 100);
}

console.log('runner: start');
prepareEnvironment();
console.log('runner: current JavaScript code finished');
