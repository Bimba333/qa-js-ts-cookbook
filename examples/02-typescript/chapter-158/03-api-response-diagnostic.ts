export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
type ApiResponse<TBody> = {
  status: number;
  body: TBody;
};

type UserResponse = {
  id: string;
  email: string;
};

const response: ApiResponse<UserResponse> = {
  status: 200,
  // @ts-expect-error email обязателен в UserResponse.
  body: {
    id: "user-1",
  },
};

console.log(response.status);
