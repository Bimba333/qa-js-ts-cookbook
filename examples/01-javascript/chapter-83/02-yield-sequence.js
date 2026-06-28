function* reportSteps() {
  yield 'collect logs';
  yield 'capture screenshot';
  yield 'upload report';
}

const steps = reportSteps();

console.log(steps.next().value);
console.log(steps.next().value);
console.log(steps.next().value);
