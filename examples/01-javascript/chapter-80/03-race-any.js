function fastHealthCheck() {
  return Promise.resolve('fast check passed');
}

function slowHealthCheck() {
  return new Promise(function resolveLater(resolve) {
    setTimeout(function finish() {
      resolve('slow check passed');
    }, 100);
  });
}

Promise.race([slowHealthCheck(), fastHealthCheck()]).then(function printWinner(result) {
  console.log(`race: ${result}`);
});

Promise.any([slowHealthCheck(), fastHealthCheck()]).then(function printFirstSuccess(result) {
  console.log(`any: ${result}`);
});
