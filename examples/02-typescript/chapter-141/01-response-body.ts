export {};

type ApiResponse = {
  status: 200;
  body: {
    id: string;
    email: string;
  };
};

type ResponseBody = ApiResponse["body"];

const body: ResponseBody = {
  id: "u-1",
  email: "qa@example.com",
};

console.log(body.id);

