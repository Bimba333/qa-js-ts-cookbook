export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
function upper(value: string | number): string {
  // @ts-expect-error value can be a number here.
  return value.toUpperCase();
}

console.log(upper("ok"));
