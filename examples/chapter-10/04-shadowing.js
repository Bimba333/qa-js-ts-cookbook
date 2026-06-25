const status = 'global';

function printStatus() {
  const status = 'local';

  console.log(status);
}

printStatus();
console.log(status);
