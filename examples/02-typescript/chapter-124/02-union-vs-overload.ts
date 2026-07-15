export {};

function formatTarget(value: number | string): string {
  return `target: ${value}`;
}

console.log(formatTarget(7));
console.log(formatTarget('checkout'));
