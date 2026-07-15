export {};

type UserRole = "admin" | "viewer";

type TestUser = {
  id: string;
  role: UserRole;
};

function canManageUsers(user: TestUser): boolean {
  return user.role === "admin";
}

const user: TestUser = {
  id: "user-1",
  role: "admin",
};

console.log(canManageUsers(user));
