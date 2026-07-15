export {};

type ApiError = {
  errorCode: string;
  message: string;
};

function isApiError(value: unknown): value is ApiError {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  return "errorCode" in value && typeof value.errorCode === "string" && "message" in value && typeof value.message === "string";
}

console.log(isApiError({ errorCode: "AUTH", message: "Token expired" }));
