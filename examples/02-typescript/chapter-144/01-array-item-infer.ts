export {};

type ArrayItem<Value> = Value extends Array<infer Item> ? Item : never;

type User = ArrayItem<Array<{ id: string; email: string }>>;

const user: User = {
  id: "u-1",
  email: "qa@example.com",
};

console.log(user.email);

