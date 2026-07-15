export {};

type ApiResponse<TBody> = {
  status: number;
  body: TBody;
};

type UserResponse = {
  id: string;
  email: string;
  role: "admin" | "viewer";
};

async function getUser(): Promise<ApiResponse<UserResponse>> {
  return {
    status: 200,
    body: {
      id: "user-1",
      email: "admin@example.test",
      role: "admin",
    },
  };
}

void getUser().then((response) => console.log(response.body.email));
