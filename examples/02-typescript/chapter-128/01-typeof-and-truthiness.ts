export {};

function formatInput(value: string | number | null): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number") {
    return `count: ${value}`;
  }

  return "empty";
}

console.log(formatInput("  smoke  "));
console.log(formatInput(0));
console.log(formatInput(null));
