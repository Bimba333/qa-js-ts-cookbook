export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE

// @ts-expect-error overload return type is not compatible with the implementation.
function normalize(value: string): string;
function normalize(value: number): number;
function normalize(value: string | number): boolean {
  return Boolean(value);
}

console.log(normalize('login'));
