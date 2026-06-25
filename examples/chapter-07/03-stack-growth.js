function stepOne() {
  console.log('stack: global -> stepOne');
  stepTwo();
}

function stepTwo() {
  console.log('stack: global -> stepOne -> stepTwo');
  stepThree();
}

function stepThree() {
  console.log('stack: global -> stepOne -> stepTwo -> stepThree');
}

stepOne();
