export {};

function firstStatus(statuses: string[]): string {
  const first = statuses[0]!;
  return first.toUpperCase();
}

console.log(firstStatus(["passed"]));
