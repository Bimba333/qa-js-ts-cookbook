export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE

type StringId = {
  id: string;
};

type NumberId = {
  id: number;
};

type ConflictingId = StringId & NumberId;

const value: ConflictingId = {
  // @ts-expect-error id cannot be both string and number.
  id: 'T-1',
};

console.log(value);
