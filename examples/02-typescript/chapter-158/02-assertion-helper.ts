export {};

type ApiResponse<TBody> = {
  status: number;
  body: TBody;
};

type UserResponse = {
  id: string;
  email: string;
};

function assertSuccessfulUserResponse(response: ApiResponse<UserResponse>): void {
  if (response.status !== 200) {
    throw new Error(`Expected 200, received ${response.status}`);
  }
}

const response: ApiResponse<UserResponse> = {
  status: 200,
  body: {
    id: "user-1",
    email: "admin@example.test",
  },
};

assertSuccessfulUserResponse(response);
console.log(response.body.id);
