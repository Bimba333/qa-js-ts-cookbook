const defaultPayload = {
  email: 'anna@example.com',
  role: 'user',
};

const adminPayload = defaultPayload;

adminPayload.role = 'admin';

console.log(defaultPayload.role);
console.log(adminPayload.role);
