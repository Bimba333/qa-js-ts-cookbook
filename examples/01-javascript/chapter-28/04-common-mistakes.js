let sharedExpectedStatus = 200;

function validateWithSharedState(actualStatus) {
  return actualStatus === sharedExpectedStatus;
}

console.log(validateWithSharedState(200));

sharedExpectedStatus = 201;

console.log(validateWithSharedState(200));

function createStatusValidator(expectedStatus) {
  return function validateStatus(actualStatus) {
    return actualStatus === expectedStatus;
  };
}

const validateOk = createStatusValidator(200);

console.log(validateOk(200));
