export {};

type ApiSuccess = {
  ok: true;
  data: string;
};

function isApiSuccess(value: unknown): value is ApiSuccess {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  return "ok" in value && value.ok === true && "data" in value && typeof value.data === "string";
}

function readData(value: unknown): string {
  if (isApiSuccess(value)) {
    return value.data;
  }

  return "no data";
}

console.log(readData({ ok: true, data: "ready" }));
