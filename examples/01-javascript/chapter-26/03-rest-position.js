function validateStatuses(expectedStatus, ...actualStatuses) {
  console.log('Expected:', expectedStatus);
  console.log('Actual statuses:', actualStatuses);
}

validateStatuses(200, 200, 201, 204);
