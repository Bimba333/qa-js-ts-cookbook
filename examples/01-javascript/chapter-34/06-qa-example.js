const apiResponse = {
  status: 200,
  body: {
    id: 101,
    name: 'Anna',
    role: 'admin'
  },
  durationMs: 340
};

const { status, body, durationMs } = apiResponse;
const { name, role } = body;

console.log(status);
console.log(name);
console.log(role);
console.log(durationMs);
