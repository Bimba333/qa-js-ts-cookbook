function prepareEnvironmentLater() {
  setTimeout(function finishPreparation() {
    console.log('environment is ready');
  }, 100);
}

console.log('start preparation');
prepareEnvironmentLater();
console.log('continue current code');
