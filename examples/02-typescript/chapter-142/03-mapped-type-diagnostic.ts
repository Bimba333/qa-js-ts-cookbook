export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
type Copy<Type> = {
  [Key in keyof Type]: Type[Key];
};

type User = {
  id: string;
};

const user: Copy<User> = {
  // @ts-expect-error id must stay a string.
  id: 123,
};

console.log(user);

