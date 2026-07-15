export {};

type User = {
  id: string;
  email: string;
  role: "admin" | "viewer";
};

type UserPatch = Partial<User>;
type PublicUser = Pick<User, "id" | "email">;

const patch: UserPatch = {
  role: "viewer",
};

const publicUser: PublicUser = {
  id: "u-1",
  email: "qa@example.com",
};

console.log(patch.role, publicUser.email);

