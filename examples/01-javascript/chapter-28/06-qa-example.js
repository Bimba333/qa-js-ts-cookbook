function createStatusValidator(expectedStatus) {
  return function validateResponse(response) {
    return response.status === expectedStatus;
  };
}

const validateSuccess = createStatusValidator(200);
const validateCreated = createStatusValidator(201);

const response = {
  status: 200
};

console.log(validateSuccess(response));
console.log(validateCreated(response));
