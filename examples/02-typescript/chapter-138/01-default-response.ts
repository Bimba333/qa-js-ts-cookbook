export {};

type ApiResponse<Data = unknown> = {
  status: number;
  body: Data;
};

const rawResponse: ApiResponse = {
  status: 200,
  body: { received: true },
};

const typedResponse: ApiResponse<{ id: string }> = {
  status: 200,
  body: { id: "u-1" },
};

console.log(rawResponse.status);
console.log(typedResponse.body.id);
