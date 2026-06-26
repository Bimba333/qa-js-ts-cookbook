function statusMatches(response) {
  return response.status === this.expectedStatus;
}

const okConfig = {
  expectedStatus: 200
};

const createdConfig = {
  expectedStatus: 201
};

const response = {
  status: 200
};

console.log(statusMatches.call(okConfig, response));
console.log(statusMatches.call(createdConfig, response));
