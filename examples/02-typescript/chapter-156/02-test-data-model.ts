export {};

type TestUser = {
  readonly id: string;
  email: string;
  role: "admin" | "viewer";
};

const testUsers = [
  {
    id: "user-1",
    email: "admin@example.test",
    role: "admin",
  },
  {
    id: "user-2",
    email: "viewer@example.test",
    role: "viewer",
  },
] satisfies readonly TestUser[];

console.log(testUsers.map((user) => user.email).join(", "));
