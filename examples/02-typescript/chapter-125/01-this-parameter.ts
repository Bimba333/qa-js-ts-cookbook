export {};

type Counter = {
  value: number;
};

function increment(this: Counter, step: number): number {
  return this.value + step;
}

const counter: Counter = { value: 2 };

console.log(increment.call(counter, 3));
