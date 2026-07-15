export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
type BrokenBox<Value> = {
  createdAt: string;
};

const box: BrokenBox<string> = {
  createdAt: "2026-01-01",
};

// @ts-expect-error BrokenBox does not preserve Value anywhere.
console.log(box.value);
