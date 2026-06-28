const requestBody = {
  email: 'qa@example.com',
  password: 'secret',
  rememberMe: true,
};

const jsonBody = JSON.stringify(requestBody);

console.log(typeof jsonBody);
console.log(jsonBody);
