function isSuccessfulStatus(actualStatus, expectedStatus) {
  return actualStatus === expectedStatus;
}

const passed = isSuccessfulStatus(200, 200);

console.log('API status check passed:', passed);
