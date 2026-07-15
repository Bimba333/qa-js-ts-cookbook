export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
function hasMessage(value: unknown): boolean {
  // @ts-expect-error value can be a primitive, so it cannot be used with in directly.
  return "message" in value;
}

console.log(hasMessage({ message: "ok" }));
