export {};

type OnlyString<Value> = Value extends string ? Value : never;

type StringPart = OnlyString<string | number | boolean>;

const value: StringPart = "ready";

console.log(value);

