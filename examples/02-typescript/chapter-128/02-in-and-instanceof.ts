export {};

type ApiSuccess = {
  ok: true;
  data: string;
};

type ApiError = {
  ok: false;
  error: Error;
};

function describe(response: ApiSuccess | ApiError): string {
  if ("data" in response) {
    return response.data;
  }

  if (response.error instanceof Error) {
    return response.error.message;
  }

  return "unknown";
}

console.log(describe({ ok: true, data: "created" }));
console.log(describe({ ok: false, error: new Error("unauthorized") }));
