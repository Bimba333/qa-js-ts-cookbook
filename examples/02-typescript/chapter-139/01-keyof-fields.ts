export {};

type User = {
  id: string;
  email: string;
  active: boolean;
};

function readField(user: User, key: keyof User) {
  return user[key];
}

const user: User = {
  id: "u-1",
  email: "qa@example.com",
  active: true,
};

console.log(readField(user, "email"));

