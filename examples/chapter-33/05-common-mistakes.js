function validateStatus(response) {
  return response.status === this.expectedStatus;
}

const assertionConfig = {
  expectedStatus: 200
};

const response = {
  status: 200
};

console.log(validateStatus.call(assertionConfig, response));
console.log(validateStatus.call(response, assertionConfig));
