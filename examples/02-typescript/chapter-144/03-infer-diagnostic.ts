export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
type FunctionResult<Fn> = Fn extends () => infer Result ? Result : never;

type NotFunction = FunctionResult<string>;

// @ts-expect-error NotFunction is never.
const value: NotFunction = "text";

console.log(value);

