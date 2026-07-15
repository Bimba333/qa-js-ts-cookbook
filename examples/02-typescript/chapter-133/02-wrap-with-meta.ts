export {};

function wrapWithMeta<Value>(value: Value) {
  return {
    value,
    createdAt: "2026-01-01T00:00:00.000Z",
  };
}

const wrapped = wrapWithMeta({ id: "case-1", status: "passed" });

console.log(wrapped.value.status);
