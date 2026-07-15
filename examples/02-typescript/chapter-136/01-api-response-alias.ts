export {};

type ApiResponse<Data> = {
  status: number;
  body: Data;
};

type UserBody = {
  id: string;
  email: string;
};

const response: ApiResponse<UserBody> = {
  status: 200,
  body: {
    id: "u-1",
    email: "user@example.test",
  },
};

console.log(response.body.email);
