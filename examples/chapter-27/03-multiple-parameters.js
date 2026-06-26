function compareStatus(actualStatus, expectedStatus) {
  console.log('Actual:', actualStatus);
  console.log('Expected:', expectedStatus);
  console.log('Match:', actualStatus === expectedStatus);
}

compareStatus(200, 200);
