export {};

type IsString<Value> = Value extends string ? true : false;

type StringCheck = IsString<string>;
type NumberCheck = IsString<number>;

const first: StringCheck = true;
const second: NumberCheck = false;

console.log(first, second);

