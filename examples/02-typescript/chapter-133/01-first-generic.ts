export {};

function first<Item>(items: Item[]): Item | undefined {
  return items[0];
}

const status = first(["passed", "failed"]);
const retry = first([1, 2, 3]);

console.log(status);
console.log(retry);
