function first() {
  console.log('first start');
  second();
  console.log('first finish');
}

function second() {
  console.log('second start');
  third();
  console.log('second finish');
}

function third() {
  console.log('third');
}

first();
