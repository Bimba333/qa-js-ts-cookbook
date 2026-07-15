export {};

type PromiseValue<Value> = Value extends Promise<infer Result>
  ? Result
  : Value;

type LoadedUser = PromiseValue<Promise<{ id: string }>>;

const user: LoadedUser = {
  id: "u-1",
};

console.log(user.id);

