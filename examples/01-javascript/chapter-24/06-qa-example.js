function validateApiStatus(actualStatus, expectedStatus) {
  console.log('Validate API status');
  console.log('Actual:', actualStatus);
  console.log('Expected:', expectedStatus);
  console.log('Passed:', actualStatus === expectedStatus);
}

validateApiStatus(200, 200);
