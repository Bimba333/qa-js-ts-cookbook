export {};

type Flags<Type> = {
  [Key in keyof Type]: boolean;
};

type LoginForm = {
  email: string;
  password: string;
};

const flags: Flags<LoginForm> = {
  email: true,
  password: false,
};

console.log(flags.email);

