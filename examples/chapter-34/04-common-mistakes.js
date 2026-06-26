function validateStatus(response) {
  return response.status === this.expectedStatus;
}

const config = {
  expectedStatus: 200
};

const response = {
  status: 200
};

console.log(validateStatus.apply(config, [response]));

try {
  validateStatus.apply([response], config);
} catch (error) {
  console.log(error.name + ': second argument must be an argument list');
}
